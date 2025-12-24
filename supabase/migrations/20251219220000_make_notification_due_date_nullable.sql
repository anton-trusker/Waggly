-- Make due_date nullable in notifications table since not all notifications have a due date (e.g. system alerts, invites)
ALTER TABLE notifications ALTER COLUMN due_date DROP NOT NULL;
