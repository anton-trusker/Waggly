-- Enable Row Level Security (RLS)
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE veterinarians ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavior_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE food ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for pets
CREATE POLICY "Users can view their own pets"
  ON pets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pets"
  ON pets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pets"
  ON pets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pets"
  ON pets FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for veterinarians
CREATE POLICY "Users can view veterinarians for their pets"
  ON veterinarians FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM pets WHERE pets.id = veterinarians.pet_id AND pets.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert veterinarians for their pets"
  ON veterinarians FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM pets WHERE pets.id = veterinarians.pet_id AND pets.user_id = auth.uid()
  ));

CREATE POLICY "Users can update veterinarians for their pets"
  ON veterinarians FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM pets WHERE pets.id = veterinarians.pet_id AND pets.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete veterinarians for their pets"
  ON veterinarians FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM pets WHERE pets.id = veterinarians.pet_id AND pets.user_id = auth.uid()
  ));

-- RLS policies for allergies
CREATE POLICY "Users can view allergies for their pets" ON allergies FOR SELECT
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = allergies.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can insert allergies for their pets" ON allergies FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM pets WHERE pets.id = allergies.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can update allergies for their pets" ON allergies FOR UPDATE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = allergies.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can delete allergies for their pets" ON allergies FOR DELETE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = allergies.pet_id AND pets.user_id = auth.uid()));

-- RLS policies for behavior_tags
CREATE POLICY "Users can view behavior_tags for their pets" ON behavior_tags FOR SELECT
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = behavior_tags.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can insert behavior_tags for their pets" ON behavior_tags FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM pets WHERE pets.id = behavior_tags.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can update behavior_tags for their pets" ON behavior_tags FOR UPDATE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = behavior_tags.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can delete behavior_tags for their pets" ON behavior_tags FOR DELETE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = behavior_tags.pet_id AND pets.user_id = auth.uid()));

-- RLS policies for medical_history
CREATE POLICY "Users can view medical_history for their pets" ON medical_history FOR SELECT
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = medical_history.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can insert medical_history for their pets" ON medical_history FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM pets WHERE pets.id = medical_history.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can update medical_history for their pets" ON medical_history FOR UPDATE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = medical_history.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can delete medical_history for their pets" ON medical_history FOR DELETE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = medical_history.pet_id AND pets.user_id = auth.uid()));

-- RLS policies for food
CREATE POLICY "Users can view food for their pets" ON food FOR SELECT
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = food.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can insert food for their pets" ON food FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM pets WHERE pets.id = food.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can update food for their pets" ON food FOR UPDATE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = food.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can delete food for their pets" ON food FOR DELETE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = food.pet_id AND pets.user_id = auth.uid()));

-- RLS policies for care_notes
CREATE POLICY "Users can view care_notes for their pets" ON care_notes FOR SELECT
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = care_notes.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can insert care_notes for their pets" ON care_notes FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM pets WHERE pets.id = care_notes.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can update care_notes for their pets" ON care_notes FOR UPDATE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = care_notes.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can delete care_notes for their pets" ON care_notes FOR DELETE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = care_notes.pet_id AND pets.user_id = auth.uid()));

-- RLS policies for vaccinations
CREATE POLICY "Users can view vaccinations for their pets" ON vaccinations FOR SELECT
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = vaccinations.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can insert vaccinations for their pets" ON vaccinations FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM pets WHERE pets.id = vaccinations.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can update vaccinations for their pets" ON vaccinations FOR UPDATE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = vaccinations.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can delete vaccinations for their pets" ON vaccinations FOR DELETE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = vaccinations.pet_id AND pets.user_id = auth.uid()));

-- RLS policies for treatments
CREATE POLICY "Users can view treatments for their pets" ON treatments FOR SELECT
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = treatments.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can insert treatments for their pets" ON treatments FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM pets WHERE pets.id = treatments.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can update treatments for their pets" ON treatments FOR UPDATE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = treatments.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can delete treatments for their pets" ON treatments FOR DELETE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = treatments.pet_id AND pets.user_id = auth.uid()));

-- RLS policies for weight_entries
CREATE POLICY "Users can view weight_entries for their pets" ON weight_entries FOR SELECT
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = weight_entries.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can insert weight_entries for their pets" ON weight_entries FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM pets WHERE pets.id = weight_entries.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can update weight_entries for their pets" ON weight_entries FOR UPDATE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = weight_entries.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can delete weight_entries for their pets" ON weight_entries FOR DELETE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = weight_entries.pet_id AND pets.user_id = auth.uid()));

-- RLS policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notifications"
  ON notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);;
