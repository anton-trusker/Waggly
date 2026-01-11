Here is a complete, structured platform specification for the user-facing Waggli product, covering UI, core pages, roles, onboarding, user flows, messaging, posting, search, pet profiles and digital passport, image recognition, service offers, requests, and more.waggli\_doc\_7\_admin\_panel\_roles.md+3​

## **Scope and goals**

Waggli is a multi-role, multi-language web and mobile platform that lets users discover and help animal cases, manage pets and their digital passports, find and book services, create service offers, message securely, and participate in the community. The spec below defines primary screens, components, flows, data, and edge-case logic for an MVP-to-scale implementation.waggli\_doc\_5\_web\_platform\_spec.md+1​

## **Global UX foundations**

* Navigation  
  * Header: logo, universal search, location, language, notifications, messages, profile menu.waggli\_doc\_5\_web\_platform\_spec.md​  
  * Footer: help, FAQ, policies, contact, social, newsletter.waggli\_doc\_5\_web\_platform\_spec.md​  
* Common components  
  * Cards: case, service, provider, article, event with consistent metadata, CTAs, skeleton loaders.waggli\_doc\_5\_web\_platform\_spec.md​  
  * Filters: collapsible on mobile; apply/reset; persistent URL params.waggli\_doc\_5\_web\_platform\_spec.md​  
  * Modals: accessible focus trap, Esc to close, enter-key submit.waggli\_doc\_5\_web\_platform\_spec.md​  
  * Loaders: skeletons and progress; optimistic UI for quick feedback.waggli\_doc\_5\_web\_platform\_spec.md​  
* Design system  
  * Color tokens with WCAG AA contrast, state colors for statuses, consistent spacing scale, typography ramp, icon set.waggli\_doc\_5\_web\_platform\_spec.md​  
* Performance  
  * SSR for SEO on web, prefetch on hover, lazy-load media, WebP/AVIF, CDN caching, API pagination.waggli\_doc\_5\_web\_platform\_spec.md​

## **Roles and access**

* Guest: browse cases/services/content; prompt to sign up for actions.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Pet Owner: pets, digital passports, create requests, donate, book services, message, community.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Non-owner helper: donate, volunteer, community, follow cases.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Provider/business: create offers, manage bookings, earnings, verification, messaging, analytics.advice-and-recomend-what-improve-in-my-new-startup.md​  
* NGO: batch cases, adoption listings, volunteers, fundraising pages.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Sponsor: matching rules, impact dashboard (phase 2).advice-and-recomend-what-improve-in-my-new-startup.md​

## **Onboarding and authentication**

* Registration methods: email+password, phone+OTP, social (Google/Apple/Facebook, regionals if market fit); email verification; optional MFA (SMS/app).waggli\_doc\_5\_web\_platform\_spec.md​  
* First-run role chooser: I need help; I want to help; I offer services; I represent organization.waggli\_doc\_5\_web\_platform\_spec.md​  
* Profile bootstrap: name, location, language, currency, notifications; pet quick-add for owners.waggli\_doc\_5\_web\_platform\_spec.md​  
* For providers: guided onboarding with verification (ID, certs, insurance), service setup, availability, payouts.advice-and-recomend-what-improve-in-my-new-startup.md​

## **Core pages**

* Home  
  * Urgent cases, search bar, service categories, community highlights, education teasers, top donors/providers.waggli\_doc\_5\_web\_platform\_spec.md​  
* Cases listing  
  * Filters: location \+ radius, species, urgency, help type, funding %, date; sort: urgency/recent/near goal/near me; grid/list.waggli\_doc\_5\_web\_platform\_spec.md​  
* Case detail  
  * Media carousel; progress; donate CTA; tabs: Story, Supporters, Updates, Comments; organizer card; related cases; verified docs block.waggli\_doc\_5\_web\_platform\_spec.md​  
* Services listing  
  * Filters: category, price, rating, availability date, verified, provider type, languages, mobile vs at-location; sort: recommended/nearest/rated/price.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Service detail  
  * Photo gallery; quick info (price, duration, location); description; calendar; pricing details; provider profile; reviews; related services.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Community hub  
  * Forums, groups, events, success stories; create post; category filters; best answers; moderation cues.waggli\_doc\_5\_web\_platform\_spec.md​  
* Messages  
  * Inbox with booking/case context cards; secure attachments; language-aware translate; safety rails reminding in-platform payments.waggli\_doc\_5\_web\_platform\_spec.md​  
* Wallet and billing  
  * Saved methods (tokenized), receipts, donation summaries, credits, transactions.waggli\_doc\_5\_web\_platform\_spec.md​  
* Help center  
  * Searchable articles, guided flows, contact forms, live chat window (phase).waggli\_doc\_5\_web\_platform\_spec.md​

## **Universal search**

* Autocomplete suggestions (cases, services, providers, community); full results page with tabs and type-specific filters; zero-result helpers widen radius/relax filters or let users create requests/alerts.waggli\_doc\_5\_web\_platform\_spec.md​

## **Pet profiles and Digital Passport**

* Pet list: cards with species/breed/age, quick actions (book, create case, add record).waggli\_doc\_5\_web\_platform\_spec.md​  
* Create pet flow  
  * Species, name, age/weight units, breed with search/mixed, photos uploader with crop; health info (allergies, conditions, meds); behavior; emergency contacts; vet details.advice-and-recomend-what-improve-in-my-new-startup.md+1​  
* Digital Passport tabs  
  * Overview; Health records (vaccinations with reminders, diagnoses, treatments, surgeries, labs, invoices); Documents (OCR, verification status); Service history; Cases.advice-and-recomend-what-improve-in-my-new-startup.md+1​  
* Image recognition (optional, phased)  
  * On photo upload: detect species/breed/age range; autofill suggestions; dedupe pet profile with similarity; flag medical document types via OCR for case verification.Platform-Waggli\_-Complete-Solution-and-Implementa-2.md​

## **Create a help request (case)**

* Stepper  
  * Help type(s) (medical, blood, physical); choose pet; story title \+ rich description; documents upload with types and counts; fundraising goal \+ cost breakdown; media; contact visibility; review \+ submit for admin approval; save draft anytime.waggli\_doc\_5\_web\_platform\_spec.md​  
* Post-publish  
  * Share kit (images \+ links), updates authoring, donor thanks broadcast, close/cancel with outcomes and refund handling according to policy.waggli\_doc\_5\_web\_platform\_spec.md​

## **Donate flow**

* Amount presets \+ custom; anonymity; message to owner; method (card/PayPal/SEPA/local); tip/fee display; 3DS; receipt and share; subscription/recurring donations (phase).waggli\_doc\_5\_web\_platform\_spec.md​

## **Blood donation network**

* Register donor: eligibility screening, vaccination/health docs, availability, radius, vet contact; verification; donor status and cooldown; match requests and appointment confirmations.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Search donors: species, location, blood type if known; request flow with clinic info; notifications and confirmations; post-donation logging and thanks.advice-and-recomend-what-improve-in-my-new-startup.md​

## **Create a service offer (providers/business)**

* Service editor  
  * Name, category/sub, description (translatable), duration, price model (fixed/hour/day/package), add-ons, location types (at provider/client/mobile), address or radius, photos/video, restrictions (species/size/age), policies, SEO fields, featured toggle.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Availability  
  * Weekly schedule, exceptions, buffer time, instant booking rules, recurring support; calendar drag-and-drop and blocked time.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Pricing tools  
  * Packages, promo codes, seasonal pricing, AI suggestions vs. market benchmarks; visibility flags (featured).Platform-Waggli\_-Complete-Solution-and-Implementa-2.md​  
* Performance  
  * Views→bookings conversion, revenue trend, most-booked slots, review summaries.advice-and-recomend-what-improve-in-my-new-startup.md​

## **Booking flow (owners)**

* Select date/time from live calendar; select pets; add-ons; address/contact; review \+ payment; confirmation with .ics and messaging; reminders; modify/cancel with policy-based refunds; in-progress tracking (check-in, GPS, photos, notes); completion, review prompt, escrow release.advice-and-recomend-what-improve-in-my-new-startup.md+1​

## **Provider dashboard**

* Today’s schedule; pending requests; earnings/payouts; performance KPIs (rating, response, acceptance); messages; service list quick actions.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Safety & compliance: insurance uploads with expiry reminders; license/cert verification; breed/regional restriction checks.Platform-Waggli\_-Complete-Solution-and-Implementa-2.md+1​

## **Community**

* Forums with categories and post types; rich editor with images; replies and best answers; moderation flags and AI pre-screen badges; profile cards and trust tie-in.waggli\_doc\_5\_web\_platform\_spec.md​  
* Groups: discover/join/create; privacy levels; discussions, events, media; admin tools for membership and moderation.waggli\_doc\_5\_web\_platform\_spec.md​  
* Events: calendar and list; RSVP and messaging; organizer tools; check-in lists.waggli\_doc\_5\_web\_platform\_spec.md​  
* Success stories: before/after, link to original cases, submission after case completion.waggli\_doc\_5\_web\_platform\_spec.md​

## **Messaging**

* Inbox with filters; conversation thread with read receipts; attachments, photos, location; booking/case context cards with quick actions; canned replies; translation assist; safety keyword warnings.waggli\_doc\_5\_web\_platform\_spec.md​

## **Profiles**

* User profile  
  * Public: avatar, bio, location (city), badges, activity, reviews; private details hidden per privacy.waggli\_doc\_5\_web\_platform\_spec.md​  
  * Settings: personal info, address (private), languages, currency, notifications, privacy toggles, connected accounts, MFA, login history, data export/delete.waggli\_doc\_5\_web\_platform\_spec.md​  
* Provider profile  
  * Public: hero, badges (verified, background-checked, licensed), services grid, reviews, certifications gallery, service area map, response/acceptance rates; contact button.advice-and-recomend-what-improve-in-my-new-startup.md​  
  * Edit: completeness score, preview as public.advice-and-recomend-what-improve-in-my-new-startup.md​

## **Search, recommendations, and ranking**

* Search relevance  
  * Cases: urgency, verification, proximity, velocity, content quality.waggli\_doc\_5\_web\_platform\_spec.md​  
  * Services: rating, responsiveness, acceptance/on-time, price competitiveness, proximity, availability, verification.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Personalized feeds  
  * For owners: services and cases tied to pets and history; for providers: demand heatmaps, suggested categories; for helpers: similar cases and local needs.Platform-Waggli\_-Complete-Solution-and-Implementa-2.md​

## **Mobile-specific**

* Bottom nav (Home, Search, Messages, Notifications, Profile); push with action buttons; camera integration for uploads; offline drafts and queued messages; deep links; widgets for bookings/donations/cases.waggli\_doc\_5\_web\_platform\_spec.md​

## **Trust, safety, disputes**

* Trust score surfaced with tooltips; verification badges; inline policy nudges; report/block in context; dispute intake with evidence and guided outcomes; transparent timeline and audit.advice-and-recomend-what-improve-in-my-new-startup.md+1​

## **Help & education**

* Help center with guided forms, searchable FAQs; expert Q\&A with verified pros; learning paths by user type; video tutorials.waggli\_doc\_5\_web\_platform\_spec.md​

## **Main user flows (step summaries)**

* Sign up and select role → complete profile → for owners: add pet → for providers: verify and add services → first action (donate, book, create case).waggli\_doc\_5\_web\_platform\_spec.md​  
* Create case → admin approval → publish → donations and updates → completion/closure → success story.waggli\_doc\_5\_web\_platform\_spec.md​  
* Search services → view detail → select slot/pets → pay → track → review.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Register blood donor → verification → receive match → schedule → confirm → cooldown.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Create service offer → set availability → get bookings → perform service (check-in/out) → payout.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Post to community → replies/best answer → badges and trust.waggli\_doc\_5\_web\_platform\_spec.md​

## **Data and files**

* Media limits: 10 photos per case/service, 5MB each; docs up to 10MB; OCR for medical docs; PII masked in public views.waggli\_doc\_5\_web\_platform\_spec.md​  
* Localization: 20+ EU languages; currency display and local payment options; regional compliance for addresses/VAT/phone formats.Platform-Waggli\_-Complete-Solution-and-Implementa-2.md​

## **Non-functional requirements**

* Performance targets: page loads \<2s; API \<200–500ms; search \<300ms; mobile launch \<3s; availability 99.9%.waggli\_doc\_5\_web\_platform\_spec.md​  
* Accessibility: WCAG 2.1 AA; keyboard, ARIA, captions, contrast; RTL layouts.waggli\_doc\_5\_web\_platform\_spec.md​  
* Security: TLS 1.3; tokenized payments; escrow for bookings; MFA; device/session management; GDPR data rights flows.Platform-Waggli\_-Complete-Solution-and-Implementa-2.md​

Here is the complete user-facing specification for Businesses, Shelters/Rescues (Non-Commercial Organizations), and Veterinary Clinics, extending the platform with organization-grade features, workflows, and UI tailored to multi-staff operations and compliance needs.advice-and-recomend-what-improve-in-my-new-startup.md+2​

## **Role taxonomy and access**

* Business (commercial): salons, grooming, boarding, training centers, pet stores; multi-location, staff scheduling, inventory/retail add-ons.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Shelter/Rescue (non-commercial): animal intake, case portfolios, adoption pipeline, volunteer coordination, fundraising pages.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Veterinary clinic: appointments, medical records sync, prescription requests, case verification, emergency triage channel.Platform-Waggli\_-Complete-Solution-and-Implementa-2.md​  
* Shared: organization profile, verification (business registration/VAT, licenses, insurance), payouts, analytics, CSR/sponsor tools (phase).advice-and-recomend-what-improve-in-my-new-startup.md​

## **Common organization onboarding**

* Step 1: Account creation \+ role selection (Business, Shelter/Rescue, Clinic).waggli\_doc\_5\_web\_platform\_spec.md​  
* Step 2: Organization profile  
  * Legal name, public display name, logo/cover, description, website, phone, contact email, social links, languages.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Step 3: Locations  
  * Address(es), hours, phone per location, geo pin, parking/access notes; import multiple via CSV.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Step 4: Verification  
  * Business registration number, VAT ID, licenses per service, insurance certificates, responsible person ID; status tracking with SLAs.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Step 5: Team  
  * Invite staff via email, assign roles (Owner, Manager, Scheduler, Provider, Finance, Volunteer Coordinator, Vet Tech); access scopes mapped to permissions.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Step 6: Payouts  
  * Beneficiary, IBAN/BIC, payout frequency, minimum threshold, tax settings.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Step 7: Go-live checklist  
  * Add services/adoption listings, connect calendars, set availability, connect messaging, publish landing.advice-and-recomend-what-improve-in-my-new-startup.md​

## **Organization dashboards**

* Header: org switcher, location switcher, alerts (verifications expiring, disputes, urgent cases), quick create (service, event, adoption, case).advice-and-recomend-what-improve-in-my-new-startup.md​  
* Overview widgets  
  * Bookings today/this week, revenue, no-shows, utilization; active fundraising; adoption pipeline; upcoming appointments; staff coverage heatmap.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Task inbox  
  * Pending verifications, intake approvals, review responses, refund requests, donor messages, triage alerts.advice-and-recomend-what-improve-in-my-new-startup.md​

## **Businesses (commercial)**

## **Core modules**

* Services and packages  
  * Multi-service catalog with bundles; duration, resources required (room/table/tool), add-ons, seasonal pricing; per-location visibility.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Resources and rooms  
  * Define rooms/stations/vehicles; link services to resources; auto conflict resolution on booking.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Calendar and scheduling  
  * Staff and resource calendars; drag-and-drop; recurring; buffer time; overbooking rules; ICS/Google/Outlook two-way sync.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Staff management  
  * Roles, skills/tags, working hours, breaks, PTO; skill-based routing for bookings; performance KPIs (rating, on-time, acceptance).advice-and-recomend-what-improve-in-my-new-startup.md​  
* Booking flows  
  * Client-facing: select location → service → staff optional → date/time → details → pay; instant booking vs request policy; deposits and cancellation windows.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Point of Sale (optional add-on)  
  * In-clinic payments, SKU catalog, taxes/VAT, receipts; attach retail to bookings; inventory minimum alerts.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Customer profiles (CRM-lite)  
  * Pets, visit history, notes, contraindications, preferences, consent forms, waivers; tags and segments.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Reviews and reputation  
  * Centralized reviews by location/service/provider; response tools; highlight featured reviews on profile pages.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Marketing  
  * Campaigns (email/SMS) to segments; promo codes; featured placement; referral tracking; Google Business sync (hours, posts).advice-and-recomend-what-improve-in-my-new-startup.md​  
* Analytics  
  * Revenue, GMV, utilization by staff/room, repeat rate, CAC proxy via campaign attribution, category performance, cancellation/no-show rates.advice-and-recomend-what-improve-in-my-new-startup.md​

## **Booking policies and logic**

* Deposits  
  * Percentage or fixed; refundable within X hours; auto-capture on window close; charge on no-show rules.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Cancellation windows  
  * Free until X hours; partial fee between X-Y; full fee \<Y hours; localized disclosures at confirmation.advice-and-recomend-what-improve-in-my-new-startup.md​  
* No-shows  
  * Auto fee if enabled; strike system with client flags; optional grace override by manager.advice-and-recomend-what-improve-in-my-new-startup.md​

## **Organization profile (public)**

* Locations grid with maps; services and pricing; staff bios; gallery; certifications/insurance badges; online booking CTA; FAQs; policies.advice-and-recomend-what-improve-in-my-new-startup.md​

## **Shelters/Rescues (non-commercial)**

## **Animal intake and management**

* Intake form  
  * Animal basics, found/owner-surrender data, health condition on arrival, microchip, photos; intake reason and legal holds; quarantine status.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Care timeline  
  * Vet exams, treatments, vaccinations, spay/neuter, behavior notes; upload documents; reminders for due care; costs logged.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Foster management  
  * Foster roster, availability, matching; foster agreements e-sign; supply tracking; messaging and check-ins.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Adoption listings  
  * Public profiles with temperament, training, compatibility, medical disclosures, adoption fee; application forms with screening questions.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Adoption pipeline  
  * Stages: Applied → Screening → Meet & Greet → Home Check → Approved → Contract → Handover → Post-adoption follow-up; tasks, notes, attachments.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Volunteers  
  * Roles (walkers, transport, events); shifts calendar; onboarding/training; hour tracking and recognition badges.advice-and-recomend-what-improve-in-my-new-startup.md​

## **Fundraising and case portfolios**

* Create campaigns  
  * Per-animal medical fund, general operations, specific projects; photos/video, goal, milestones; updates and donor wall.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Matching sponsors  
  * Corporate match rules by category/species/region; live match meter; sponsor branding placements.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Transparency  
  * Cost breakdown, invoices, treatment outcomes; post-campaign impact stories; compliance disclosures.advice-and-recomend-what-improve-in-my-new-startup.md​

## **Safety and compliance**

* Data consent for adopters/donors; GDPR exports; confidentiality on sensitive cases; incident reporting workflow.Platform-Waggli\_-Complete-Solution-and-Implementa-2.md​

## **Veterinary clinics**

## **Appointments and scheduling**

* Appointment types  
  * Exam, vaccination, surgery, follow-up, tele-vet; durations and prep/post buffers; required room/equipment; pre-visit forms.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Triage and emergencies  
  * Urgent case channel: owners flag emergency, clinic sees alert feed by distance; accept for triage with ETA; queue management.Platform-Waggli\_-Complete-Solution-and-Implementa-2.md​  
* Calendar  
  * Doctor/room calendars; surgery blocks; overrun handling; ICS/Google/Outlook sync; waitlist auto-fill.advice-and-recomend-what-improve-in-my-new-startup.md​

## **Medical records and digital passport sync**

* Consent-gated read access to pet’s Digital Passport; push updates to passport for vaccinations/treatments; upload PDFs/images; OCR recognition to map records fields.Platform-Waggli\_-Complete-Solution-and-Implementa-2.md+1​  
* Prescriptions  
  * Issue, renew, attach dosage instructions; e-sign; refill requests; pharmacy integration hook.Platform-Waggli\_-Complete-Solution-and-Implementa-2.md​  
* Case verification  
  * Clinic verifies diagnosis/cost estimates for fundraising cases; clinic logo “Verified by” on case; optional direct-to-clinic disbursement.Platform-Waggli\_-Complete-Solution-and-Implementa-2.md​

## **Billing and payouts**

* Clinic payouts for services; direct billing for surgeries tied to cases; escrow split (donations → clinic) with proof-of-service upload before release.Platform-Waggli\_-Complete-Solution-and-Implementa-2.md​

## **Tele-vet (phase)**

* Secure video consults; prepayment; consent; note-taking; post-visit summary to owner; attach to Digital Passport.advice-and-recomend-what-improve-in-my-new-startup.md​

## **Shared organization modules**

## **Team and roles**

* Role matrix  
  * Owner: all; Manager: locations/services/staff; Scheduler: calendars/bookings; Provider/Vet: service delivery/records; Finance: payouts/invoices/taxes; Volunteer Coordinator: volunteers/adoptions.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Staff onboarding  
  * Invite, accept, complete profile, verify credentials (license uploads for vets/trainers), assign locations and schedules.advice-and-recomend-what-improve-in-my-new-startup.md​

## **Calendars and availability**

* Views: by staff, by location, by room/resource; filters; drag-drop; conflict detection; recurring patterns; blackout dates.advice-and-recomend-what-improve-in-my-new-startup.md​

## **Messaging and CRM**

* Unified inbox by organization with assignment; SLA timers; templates; conversation linking to animals/bookings/adoptions/cases; internal notes.waggli\_doc\_5\_web\_platform\_spec.md​

## **Payments and finance**

* Payout schedules, thresholds, bank verification; invoices and VAT reports; deposits collection; refunds and adjustments with audit trail.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Donations to NGOs  
  * Separate ledger; donor receipts; donor list export; transparency reporting; restricted-use funds tagging.advice-and-recomend-what-improve-in-my-new-startup.md​

## **Public pages**

* Organization landing  
  * Hero, mission, badges (verified/licensed/insured), locations, services, adoptables, campaigns, events, testimonials, contact; SEO fields; schema.org markup for LocalBusiness/VeterinaryCare/NGO.advice-and-recomend-what-improve-in-my-new-startup.md​

## **Analytics**

* Dashboards per org/location  
  * Bookings, revenue, utilization, cancellations, average basket (with POS), top services, staff performance, donor growth, adoption cycle time, surrender vs adoption ratio.advice-and-recomend-what-improve-in-my-new-startup.md​

## **Key user flows (step-level)**

## **Business: create multi-service catalog and start booking**

1. Complete org onboarding → add locations → verify documents → add services and resources → set staff and availability → publish profile → receive bookings → assign staff → deliver service (check-in/out) → payout → request review.advice-and-recomend-what-improve-in-my-new-startup.md​

## **Shelter: intake to adoption with fundraising**

1. Intake animal → create fundraising case and publish → receive donations and post updates → vet visits sync to passport → publish adoption listing → screen applicants → meet & greet → contract and handover → post-adoption follow-up → publish success story.advice-and-recomend-what-improve-in-my-new-startup.md​

## **Clinic: verify a case and bill directly**

1. Owner creates case and selects clinic → clinic verifies diagnosis/estimate → donations flow to escrow → surgery completed → clinic uploads invoice → escrow released to clinic → case closed with outcome update.Platform-Waggli\_-Complete-Solution-and-Implementa-2.md​

## **Verification and compliance specifics**

* Businesses: business register (country-specific), VAT, liability insurance, staff background checks for certain services (e.g., in-home).advice-and-recomend-what-improve-in-my-new-startup.md​  
* Shelters/NGOs: registration documents, board/contact verification, dedicated donation ledger, transparency commitments.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Clinics: medical licenses, doctor registrations, facility licenses; heightened data privacy for medical records; explicit user consent capture and revocation.Platform-Waggli\_-Complete-Solution-and-Implementa-2.md​

## **Edge-case logic**

* Location downtime: auto-hide bookable slots and show notice; offer waitlist transfer to other locations.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Overcapacity: resource conflict → suggest alternate times/provider; keep deposit hold until client decides within window.advice-and-recomend-what-improve-in-my-new-startup.md​  
* Refund precedence: donation refunds subject to policy and fraud checks; booking refunds apply policy matrix; split payments (donation+client copay) prorated on service cancellation.Platform-Waggli\_-Complete-Solution-and-Implementa-2.md​

## **Mobile UX for organizations**

* Staff app mode: today’s schedule, check-in/out, photo notes, quick messages, navigation links, incident reporting; offline caching for schedules and forms.waggli\_doc\_5\_web\_platform\_spec.md​  
* NGO mobile: scan intake via camera, quick update posts to campaigns, volunteer shift check-ins via QR.advice-and-recomend-what-improve-in-my-new-startup.md​

## **Data model additions (high level)**

* Organizations, Locations, Resources, StaffRoles, Services, Packages, Bookings, Deposits, Animals, Intakes, FosterAssignments, AdoptionApplications, VolunteerShifts, Campaigns, Donations, MedicalRecords, Prescriptions, Verifications, Invoices.Platform-Waggli\_-Complete-Solution-and-Implementa-2.md+1​

