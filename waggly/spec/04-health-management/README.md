# 04 - Health Management

This section specifies all health tracking features including veterinary visits, vaccinations, treatments, medications, health metrics, and allergy management.

---

## Documents in This Section

### Overview
| Document | Description |
|----------|-------------|
| [health-overview-prd.md](./health-overview-prd.md) | Health management system PRD |

### Veterinary Visits
| Document | Description |
|----------|-------------|
| [veterinary-visits/visits-prd.md](./veterinary-visits/visits-prd.md) | Visit types, user stories |
| [veterinary-visits/visits-form-spec.md](./veterinary-visits/visits-form-spec.md) | Form fields, validation |
| [veterinary-visits/visits-ui-spec.md](./veterinary-visits/visits-ui-spec.md) | Modal design, responsive |
| [veterinary-visits/visits-api.md](./veterinary-visits/visits-api.md) | CRUD endpoints |

### Vaccinations
| Document | Description |
|----------|-------------|
| [vaccinations/vaccinations-prd.md](./vaccinations/vaccinations-prd.md) | Vaccine tracking PRD |
| [vaccinations/vaccinations-form-spec.md](./vaccinations/vaccinations-form-spec.md) | Form fields, database |
| [vaccinations/vaccine-schedules.md](./vaccinations/vaccine-schedules.md) | Species schedules |
| [vaccinations/vaccination-reminders.md](./vaccinations/vaccination-reminders.md) | Reminder logic |
| [vaccinations/vaccinations-api.md](./vaccinations/vaccinations-api.md) | API specification |

### Treatments & Medications
| Document | Description |
|----------|-------------|
| [treatments-medications/treatments-prd.md](./treatments-medications/treatments-prd.md) | Medication management |
| [treatments-medications/treatments-form-spec.md](./treatments-medications/treatments-form-spec.md) | Dosage, frequency |
| [treatments-medications/medication-database.md](./treatments-medications/medication-database.md) | Drug database |
| [treatments-medications/medication-reminders.md](./treatments-medications/medication-reminders.md) | Smart reminders |
| [treatments-medications/treatments-api.md](./treatments-medications/treatments-api.md) | API specification |

### Health Metrics
| Document | Description |
|----------|-------------|
| [health-metrics/metrics-prd.md](./health-metrics/metrics-prd.md) | Weight, vitals, BCS |
| [health-metrics/vital-signs-spec.md](./health-metrics/vital-signs-spec.md) | Heart rate, temp |
| [health-metrics/body-condition-score.md](./health-metrics/body-condition-score.md) | 9-point BCS scale |
| [health-metrics/weight-tracking.md](./health-metrics/weight-tracking.md) | Weight history |
| [health-metrics/metrics-api.md](./health-metrics/metrics-api.md) | API specification |

### Allergies
| Document | Description |
|----------|-------------|
| [allergies/allergies-prd.md](./allergies/allergies-prd.md) | Allergy documentation |
| [allergies/allergy-types.md](./allergies/allergy-types.md) | Food, environmental |
| [allergies/allergies-api.md](./allergies/allergies-api.md) | API specification |

### Database
| Document | Description |
|----------|-------------|
| [database-schema.sql](./database-schema.sql) | All health tables |

---

## Health Dashboard Overview

The health dashboard provides a comprehensive view of a pet's health status:

| Widget | Content |
|--------|---------|
| Health Score | 0-100 score with trend |
| Recent Activity | Timeline of health events |
| Upcoming Reminders | Due vaccinations, meds |
| Current Medications | Active treatments |
| Vaccination Status | Up to date / Overdue |
| Quick Actions | Add vaccine, visit, treatment |

---

## Key Metrics

- **Average records per pet**: 12-15/year
- **Vaccination compliance**: >90% target
- **Medication adherence**: 85%+ target
- **Health score tracking**: Weekly updates
