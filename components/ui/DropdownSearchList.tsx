import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Platform, ScrollView } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { useLocale } from '@/hooks/useLocale';
import Radio from '@/components/ui/Radio';

type Item = string;

type Props = {
  items: Item[];
  placeholder?: string;
  loading?: boolean;
  selected?: Item | null;
  onSelect: (item: Item) => void;
  onQueryChange?: (q: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
};

export default function DropdownSearchList({ items, placeholder = 'Search', loading = false, selected = null, onSelect, onQueryChange, onLoadMore, hasMore = false, loadingMore = false }: Props) {
  const [query, setQuery] = useState(selected || '');
  const [showList, setShowList] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const blurTimeout = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<TextInput>(null);
  const { t } = useLocale();

  useEffect(() => {
    if (selected && selected !== query) {
      setQuery(selected);
      setShowList(false);
    }
  }, [selected]);

  useEffect(() => {
    const t = setTimeout(() => {
      onQueryChange?.(query);
    }, 300);
    return () => clearTimeout(t);
  }, [query, onQueryChange]);

  const handleTextChange = (text: string) => {
    setQuery(text);
    setShowList(!!text);
    // If text is cleared, notify parent
    if (text === '') {
      onSelect('');
    }
  };

  const filtered = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    const results = items.filter(i => i.toLowerCase().includes(q)).sort((a, b) => a.localeCompare(b));
    
    // If the exact query is not in the results, we can treat it as a potential custom value
    // We don't add it to 'results' directly here to keep sections clean, 
    // but we will handle it in the rendering logic or a separate 'custom' section.
    return results;
  }, [items, query]);

  const sections = useMemo(() => {
    const map: Record<string, Item[]> = {};
    for (const i of filtered) {
      const k = i[0]?.toUpperCase() || '#';
      if (!map[k]) map[k] = [];
      map[k].push(i);
    }
    const keys = Object.keys(map).sort((a, b) => a.localeCompare(b));
    return keys.map(k => ({ title: k, data: map[k] }));
  }, [filtered]);

  const showCustomOption = query && !items.some(i => i.toLowerCase() === query.toLowerCase());

  const renderHighlighted = (text: string) => {
    if (!query) return <Text style={styles.itemLabel}>{text}</Text>;
    const i = text.toLowerCase().indexOf(query.toLowerCase());
    if (i === -1) return <Text style={styles.itemLabel}>{text}</Text>;
    const start = text.slice(0, i);
    const match = text.slice(i, i + query.length);
    const end = text.slice(i + query.length);
    return (
      <Text style={styles.itemLabel}>
        <Text>{start}</Text>
        <Text style={styles.highlight}>{match}</Text>
        <Text>{end}</Text>
      </Text>
    );
  };

  const onKeyPress = (e: any) => {
    const key = e?.nativeEvent?.key;
    if (!key) return;
    if (key === 'ArrowDown') {
      setFocusedIndex(p => Math.min(p + 1, filtered.length - 1));
    } else if (key === 'ArrowUp') {
      setFocusedIndex(p => Math.max(p - 1, 0));
    } else if (key === 'Enter' && focusedIndex >= 0) {
      const item = filtered[focusedIndex];
      if (item) onSelect(item);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.inputButton}
        onPress={() => setShowList(true)}
      >
        <Text style={[styles.inputText, !query && styles.placeholderText]}>
          {query || t(placeholder, { defaultValue: placeholder })}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showList}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowList(false)}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{t(placeholder, { defaultValue: placeholder })}</Text>
                    <TouchableOpacity onPress={() => setShowList(false)}>
                        <Text style={styles.closeText}>{t('common.close', { defaultValue: 'Close' })}</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.searchContainer}>
                    <TextInput
                        ref={inputRef}
                        style={styles.searchInput}
                        placeholder={t('common.search', { defaultValue: 'Search...' })}
                        placeholderTextColor={colors.textSecondary}
                        value={query}
                        onChangeText={handleTextChange}
                        autoFocus={true}
                    />
                    {query.length > 0 && (
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={() => { setQuery(''); onSelect(''); }}
                        >
                            <Text style={styles.clearText}>×</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {loading && (
                    <View style={styles.loading}>
                        <ActivityIndicator size="small" color={colors.primary} />
                    </View>
                )}

                <ScrollView
                    style={styles.list}
                    contentContainerStyle={styles.listContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {showCustomOption && (
                        <TouchableOpacity
                            style={[styles.itemRow, styles.customOption]}
                            onPress={() => { onSelect(query); setShowList(false); }}
                        >
                            <View style={styles.itemLeft}>
                                <Text style={styles.itemLabel}>
                                Use "{query}"
                                <Text style={styles.customTag}> (Custom)</Text>
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}

                    {sections.map((section) => (
                        <View key={section.title}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>{section.title}</Text>
                            </View>
                            {section.data.map((item, itemIndex) => (
                                <TouchableOpacity
                                    key={`${item}-${itemIndex}`}
                                    style={styles.itemRow}
                                    onPress={() => { onSelect(item); setQuery(item); setShowList(false); }}
                                >
                                    <View style={styles.itemLeft}>{renderHighlighted(item)}</View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                    
                    {hasMore && !loadingMore && (
                        <TouchableOpacity onPress={onLoadMore} style={styles.loadMoreButton}>
                            <Text style={styles.loadMoreText}>{t('common.load_more', { defaultValue: 'Load more' })}</Text>
                        </TouchableOpacity>
                    )}
                    
                    {loadingMore && (
                        <View style={styles.loadingMore}><ActivityIndicator size="small" color={colors.primary} /></View>
                    )}
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  inputText: {
    fontSize: 16,
    color: colors.text,
  },
  placeholderText: {
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    padding: 16,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    paddingRight: 40,
    color: colors.text,
    fontSize: 16,
  },
  clearButton: {
    position: 'absolute',
    right: 24,
    top: 24,
  },
  clearText: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 40,
  },
  sectionHeader: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.highlight,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  itemRow: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemLeft: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 16,
    color: colors.text,
  },
  highlight: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  customOption: {
    backgroundColor: colors.iconBackgroundBlue,
  },
  customTag: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  loading: {
    padding: 20,
    alignItems: 'center',
  },
  loadMoreButton: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  loadMoreText: {
    color: colors.primary,
    fontWeight: '600',
  },
  loadingMore: {
    padding: 16,
    alignItems: 'center',
  },
  empty: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
  },
});
