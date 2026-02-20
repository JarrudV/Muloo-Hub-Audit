import { Client } from '@hubspot/api-client';
import { FilterOperatorEnum as ContactsFilterOp } from '@hubspot/api-client/lib/codegen/crm/contacts/models/Filter';
import { FilterOperatorEnum as DealsFilterOp } from '@hubspot/api-client/lib/codegen/crm/deals/models/Filter';

export interface AuditResults {
    overallScore: number;
    metrics: {
        title: string;
        status: 'success' | 'warning' | 'error';
        description: string;
        recommendation?: string;
    }[];
}

export async function runAuditEngine(accessToken: string): Promise<AuditResults> {
    const hubspotClient = new Client({ accessToken });
    const metrics: AuditResults['metrics'] = [];
    let scoreDeductions = 0;

    try {
        // 1. Check Unassigned Contacts
        const unassignedSearch = await hubspotClient.crm.contacts.searchApi.doSearch({
            query: '',
            filterGroups: [{
                filters: [{
                    propertyName: 'hubspot_owner_id',
                    operator: ContactsFilterOp.NotHasProperty
                }]
            }],
            sorts: [],
            properties: ['email'],
            limit: 100,
            after: 0
        } as any);

        const unassignedCount = unassignedSearch.total;
        if (unassignedCount > 50) {
            scoreDeductions += 20;
            metrics.push({ title: 'Unassigned Leads', status: 'error', description: `Found ${unassignedCount} Contacts with no Owner assigned. Highly impacts lead routing.`, recommendation: 'Create an Active List filtering for "Contact Owner is Unknown" and use bulk edit to assign these to a specific rep or a generic routing queue.' });
        } else if (unassignedCount > 0) {
            scoreDeductions += 10;
            metrics.push({ title: 'Unassigned Leads', status: 'warning', description: `Found ${unassignedCount} Contacts with no Owner assigned.`, recommendation: 'Set up a basic rotation workflow so no new incoming lead slips through without an owner.' });
        } else {
            metrics.push({ title: 'Unassigned Leads', status: 'success', description: `Excellent! All leads have an owner.` });
        }

        // 2. Check for Inactive Users
        const usersResponse = await fetch('https://api.hubapi.com/settings/v3/users', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            const totalUsers = usersData.results?.length || 0;
            const superAdmins = usersData.results?.filter((u: any) => u.superAdmin).length || 0;

            if (superAdmins === totalUsers && totalUsers > 1) {
                scoreDeductions += 15;
                metrics.push({ title: 'User Permissions', status: 'error', description: `All ${totalUsers} users are Super Admins. This is a severe security risk.`, recommendation: 'Go to Settings > Users & Teams. Demote non-executive staff to standard roles to protect against accidental deletions or mass exports.' });
            } else {
                metrics.push({ title: 'User Permissions', status: 'success', description: `User permissions and roles seem logically distributed.` });
            }
        }

        // 3. Property Hygiene (Check Custom Properties)
        const propertiesResponse = await hubspotClient.crm.properties.coreApi.getAll('contacts');
        const customProps = propertiesResponse.results.filter(p => !p.hubspotDefined);

        if (customProps.length > 100) {
            scoreDeductions += 15;
            metrics.push({ title: 'Property Hygiene', status: 'warning', description: `High property sprawl: ${customProps.length} custom contact properties detected.`, recommendation: 'Navigate to Settings > Properties. Filter by "Custom" and look for properties with 0 values. Archive anything unused to clean up your CRM view.' });
        } else {
            metrics.push({ title: 'Property Hygiene', status: 'success', description: `${customProps.length} custom contact properties. Clean data model.` });
        }

        // 4. Pipeline Consistency (Sales Health)
        const dealsSearch = await hubspotClient.crm.deals.searchApi.doSearch({
            query: '',
            filterGroups: [{
                filters: [{
                    propertyName: 'days_to_close',
                    operator: DealsFilterOp.Gte,
                    value: '90'
                }]
            }],
            sorts: [],
            properties: ['dealname'],
            limit: 100,
            after: 0
        } as any);

        const stagnantDealsCount = dealsSearch.total;
        if (stagnantDealsCount > 20) {
            scoreDeductions += 15;
            metrics.push({ title: 'Pipeline Consistency', status: 'error', description: `Found ${stagnantDealsCount} stagnant deals open longer than 90 days.`, recommendation: 'Set up an automated workflow that sends a slack/email alert to the Sales Manager when a Deal hits 60+ days without a stage change.' });
        } else if (stagnantDealsCount > 0) {
            scoreDeductions += 5;
            metrics.push({ title: 'Pipeline Consistency', status: 'warning', description: `Found ${stagnantDealsCount} stagnant deals open longer than 90 days.`, recommendation: 'Implement a "Closed Lost - Stagnant" reason and encourage reps to clear out the pipeline weekly.' });
        } else {
            metrics.push({ title: 'Pipeline Consistency', status: 'success', description: `Excellent! Your sales pipeline is moving efficiently.` });
        }

        // 5. Form Hygiene (Marketing Health)
        const sourceSearch = await hubspotClient.crm.contacts.searchApi.doSearch({
            query: '',
            filterGroups: [{
                filters: [{
                    propertyName: 'hs_analytics_source',
                    operator: ContactsFilterOp.Eq,
                    value: 'OFFLINE'
                }]
            }],
            sorts: [],
            properties: ['email'],
            limit: 100,
            after: 0
        } as any);

        const offlineSourceCount = sourceSearch.total;
        if (offlineSourceCount > 100) {
            scoreDeductions += 10;
            metrics.push({ title: 'Marketing Attribution', status: 'warning', description: `${offlineSourceCount} contacts tracked as Offline Sources. Potential form tracking issues.`, recommendation: 'Ensure all external website forms are using the native HubSpot tracking script or the active Forms API integration to correctly attribute lead acquisition.' });
        } else {
            metrics.push({ title: 'Marketing Attribution', status: 'success', description: `Lead capture attribution looks healthy.` });
        }

    } catch (error) {
        console.error('Audit Engine Error:', error);
        metrics.push({ title: 'API Access', status: 'error', description: 'Could not complete all checks due to portal permissions.', recommendation: 'Ensure the connected User has Read Access across Contacts, Deals, and Settings.' });
    }

    const overallScore = Math.max(0, 100 - scoreDeductions);

    return {
        overallScore,
        metrics
    };
}
