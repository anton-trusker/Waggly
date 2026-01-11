import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { colors } from '@/styles/commonStyles';
import { useLocale } from '@/hooks/useLocale';

export type SearchableSelectItem = {
  value: string;
  label: string;
  icon?: string; // Emoji or similar
};

type Props = {
  value?: string;
  onChange: (value: string) => void;
  items: SearchableSelectItem[];
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  error?: string;
  containerStyle?: import('react-native').ViewStyle;
};

export default function SearchableSelect({
  value,
  onChange,
  items,
  label = 'Select',
  placeholder = 'Select option',
  searchPlaceholder = 'Search...',
  error,
  containerStyle,
}: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const { t } = useLocale();

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      item.label.toLowerCase().includes(q) ||
      item.value.toLowerCase().includes(q)
    );
  }, [query, items]);

  const selected = items.find((item) => item.value === value);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{t(label, { defaultValue: label })}</Text>}
      <TouchableOpacity
        style={[styles.input, error ? { borderColor: colors.statusError } : {}, containerStyle] as any}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={t('open_selector', { defaultValue: `Open ${label} selector`, label })}
      >
        {selected ? (
          <Text style={styles.valueText}>
            {selected.icon ? `${selected.icon} ` : ''}{selected.label}
          </Text>
        ) : (
          <Text style={styles.placeholder}>{t(placeholder, { defaultValue: placeholder })}</Text>
        )}
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalRoot}>
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>{t(label, { defaultValue: label })}</Text>
            <TextInput
              style={styles.search}
              placeholder={t(searchPlaceholder, { defaultValue: searchPlaceholder })}
              placeholderTextColor={colors.textSecondary}
              value={query}
              onChangeText={setQuery}
            />
            <FlashList
              data={filteredItems}
              keyExtractor={(item) => item.value}
              estimatedItemSize={52}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => { onChange(item.value); setOpen(false); }}
                  accessibilityRole="button"
                  accessibilityLabel={t('select_item', { defaultValue: `Select ${item.label}`, item: item.label })}
                >
                  <Text style={styles.optionText}>
                    {item.icon ? `${item.icon} ` : ''}{item.label}
                  </Text>
                </TouchableOpacity>
              )}
              keyboardShouldPersistTaps="handled"
            />
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setOpen(false)}
              accessibilityRole="button"
              accessibilityLabel={t('close_selector', { defaultValue: 'Close selector' })}
            >
              <Text style={styles.closeText}>{t('common.close', { defaultValue: 'Close' })}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 13, color: colors.textSecondary, marginBottom: 6 },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  valueText: { color: colors.text, fontSize: 15 },
  placeholder: { color: colors.textSecondary, fontSize: 15 },
  modalRoot: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
  sheet: { backgroundColor: colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 12, maxHeight: '70%' },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, marginBottom: 8 },
  sheetTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 8, textAlign: 'center' },
  search: {
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
    color: colors.text,
  },
  option: { paddingVertical: 12, paddingHorizontal: 6, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  optionText: { color: colors.text, fontSize: 15 },
  closeBtn: { alignSelf: 'center', marginTop: 8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  closeText: { color: colors.text },
});
