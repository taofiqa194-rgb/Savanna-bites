# Security Specification: Savanna Bites

## 1. Data Invariants
- Menu items can be read by anyone (public menu catalog), but only authenticated administrators can create, update, or delete menu items.
- Orders can be created by any customer or guest with valid fields. Once created, only the authenticated order author (`userId == request.auth.uid`) or an administrator can view or read the order details. Orders cannot be deleted by customers.
- Reservations can be submitted by any customer or guest. Only administrators or the booking author can review reservations.
- Reviews can be read by anyone. New reviews must have valid scores (1-5), sane length limits, and cannot tamper with author identities.
- Restaurant settings can be read publicly by visitors to display opening hours, WhatsApp contact, address, and announcements, but only administrators can update settings.
- User profiles can only be read and updated by their owner (`userId == request.auth.uid`) or an admin. Users cannot grant themselves administrator privileges.

## 2. Dirty Dozen Test Payloads
1. Injecting 50KB strings into `name` or `description` to trigger resource exhaustion.
2. Attempting to set `price` to negative numbers or string types on menu items.
3. Attempting to update `restaurantSettings` without administrator role.
4. Non-admin user attempting to delete an existing customer order.
5. Customer attempting to change another customer's order `status` or address.
6. Spoofing `userId` on order submission to access private past orders of another user.
7. Attempting to assign `role: 'admin'` on `users/{userId}` during self-registration.
8. Submitting reviews with rating > 5 or rating < 1.
9. Injecting invalid document IDs with special characters or excessive length (>128 chars).
10. Unauthenticated user attempting to list all customer orders in the database.
11. Admin impersonation by altering client claim tokens without verified document lookup.
12. Attempting to overwrite immutable creation timestamps on existing orders.

## 3. Fortress Rule Protections
- `isValidId(id)` verifies all target document IDs meet alphanumeric format and size boundaries.
- `isAdmin()` verifies caller UID exists in `/admins/$(request.auth.uid)` or matches admin document.
- Default deny catch-all `match /{document=**} { allow read, write: if false; }`.
- Explicit schema validators for menu items, orders, reservations, reviews, settings, and user profiles.
