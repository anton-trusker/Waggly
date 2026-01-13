# 07 - Calendar & Reminders

This section specifies the calendar, events, and smart reminder system.

---

## Documents in This Section

| Document | Description |
|----------|-------------|
| [reminders-prd.md](./reminders-prd.md) | Smart reminder system PRD |
| [calendar-integration.md](./calendar-integration.md) | External calendar sync |
| [notification-spec.md](./notification-spec.md) | Push/email notifications |
| [database-schema.sql](./database-schema.sql) | Events and reminders tables |

---

## Reminder Types

| Type | Trigger | Notifications |
|------|---------|---------------|
| Vaccination Due | Next due date | 14d, 7d, 1d, 0d, +7d |
| Medication Time | Scheduled times | At scheduled time |
| Vet Appointment | Scheduled date | 1d before |
| Monthly Parasite Prev | Monthly schedule | 3d, 0d before |
| Annual Checkup | 1 year since last | 30d before |
| Custom Reminder | User-set date | User-set timing |

---

## Smart Features

- **Optimal Timing**: AI learns best reminder times
- **Snooze Logic**: Intelligent snooze options
- **Escalation**: Missed reminders escalate to email
- **Co-owner Sync**: Notify all caregivers
- **Calendar Sync**: Export to Apple/Google Calendar
