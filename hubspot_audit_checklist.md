# HubSpot Health Check: The 10-Point Checklist

This checklist defines the "Value Proposition" of the lead magnet. Each point represents a common CRM pitfall that, when solved, delivers immediate ROI.

1.  **Duplicate Records (Contacts & Companies)**
    *   *Check:* Use HubSpot's Search API to identify records with high similarity or identical domains/emails.
    *   *Lead Impact:* Duplicate data ruins reporting and causes sales friction.

2.  **Unassigned Contacts/Companies**
    *   *Check:* Records where `hubspot_owner_id` is empty.
    *   *Lead Impact:* Leads falling through the cracks is the biggest "missed revenue" indicator.

3.  **Property Usage Hygiene**
    *   *Check:* Custom properties created but never populated (0% usage rate).
    *   *Lead Impact:* "Property Sprawl" makes CRM adoption difficult for sales teams.

4.  **Inactive Users / Seat Efficiency**
    *   *Check:* Users with no login activity in >30 days.
    *   *Lead Impact:* Saving money on unused paid seats (Service/Sales Hub).

5.  **Form Submission Errors [IMPLEMENTED]**
    *   *Check:* Evaluated contacts grouped by `hs_analytics_source == OFFLINE` to track potential form validation loss.
    *   *Lead Impact:* Direct impact on lead conversion rates.

6.  **Pipeline Consistency [IMPLEMENTED]**
    *   *Check:* Evaluated Deals where `days_to_close` is exceptionally stagnant (> 90 days).
    *   *Lead Impact:* Identifying "zombie deals" improves forecast accuracy.

7.  **Email Deliverability Health**
    *   *Check:* Bounce rates and unsubscribe spikes across recent marketing emails.
    *   *Lead Impact:* Protecting the domain reputation is critical for marketing.

8.  **Workflow Automation Errors**
    *   *Check:* Count of "Actions needing attention" in the Workflow Health tool.
    *   *Lead Impact:* Broken automations (e.g., lead rotation) stop the sales machine.

9.  **Integration Health**
    *   *Check:* API error logs or disconnected apps in the App Marketplace.
    *   *Lead Impact:* Ensuring data flows correctly between CRM and other tools.

10. **Custom Object Overload (Enterprise)**
    *   *Check:* Usage of custom objects vs. standard objects.
    *   *Lead Impact:* Avoiding over-engineering that leads to technical debt.
