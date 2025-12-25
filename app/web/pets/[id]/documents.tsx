import React, { useState } from 'react';
import { View, ScrollView, Text, Pressable, TextInput } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { usePets } from '@/hooks/usePets';
import { useDocuments } from '@/hooks/useDocuments';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function DocumentsTab() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pets } = usePets();
  const { documents } = useDocuments(id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedTime, setSelectedTime] = useState('Last 6 Months');

  const pet = pets?.find(p => p.id === id);
  if (!pet) return null;

  // Mock document types and icons
  const documentTypes = {
    'Vaccines': { icon: 'vaccines', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400' },
    'Lab Report': { icon: 'biotech', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
    'Invoice': { icon: 'receipt_long', color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
    'Prescription': { icon: 'prescriptions', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
    'Insurance': { icon: 'health_and_safety', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' },
    'Other': { icon: 'folder', color: 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400' },
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDocumentIcon = (type: string) => {
    return documentTypes[type as keyof typeof documentTypes] || documentTypes['Other'];
  };

  // Mock documents data - in real app this would come from useDocuments hook
  const mockDocuments = [
    {
      id: '1',
      name: 'Rabies Vaccination Cert.',
      type: 'Vaccines',
      date: '2023-10-12',
      clinic: 'Downtown Vet Clinic',
      size: '1.2 MB'
    },
    {
      id: '2',
      name: 'Blood Panel Analysis',
      type: 'Lab Report',
      date: '2023-09-28',
      clinic: 'Pet Labs International',
      size: '856 KB'
    },
    {
      id: '3',
      name: 'Annual Checkup Bill',
      type: 'Invoice',
      date: '2023-09-15',
      clinic: 'Downtown Vet Clinic',
      amount: '€124.50'
    },
    {
      id: '4',
      name: 'Apoquel 5mg - Refill',
      type: 'Prescription',
      date: '2023-08-10',
      clinic: 'Dr. Sarah Smith',
      size: '342 KB'
    },
    {
      id: '5',
      name: 'Pet Insurance Policy 2023',
      type: 'Insurance',
      date: '2023-01-01',
      clinic: 'SafePaws Insurance Ltd.',
      size: '2.1 MB'
    },
    {
      id: '6',
      name: 'Adoption Papers',
      type: 'Other',
      date: '2020-11-15',
      clinic: 'Happy Tails Shelter',
      size: '567 KB'
    }
  ];

  const allDocs = documents || mockDocuments;

  return (
    <ScrollView className="flex-1 bg-background-light dark:bg-background-dark">
      <View className="p-4 lg:p-8">
        <View className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <View className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <Text className="text-xl font-bold text-text-light dark:text-text-dark">All Documents ({allDocs.length})</Text>
            <View className="flex gap-3 w-full md:w-auto">
              <Pressable 
                onPress={() => router.push(`/web/pets/documents/scan?petId=${id}`)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-slate-800 text-text-light dark:text-text-dark rounded-xl font-medium shadow-sm transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <IconSymbol name="document_scanner" className="text-primary group-hover:scale-110 transition-transform" size={20} />
                <Text>Scan Doc</Text>
              </Pressable>
              <Pressable 
                onPress={() => router.push(`/web/pets/documents/upload?petId=${id}`)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium shadow-lg shadow-primary/25 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <IconSymbol name="upload_file" className="group-hover:scale-110 transition-transform" size={20} />
                <Text>Upload File</Text>
              </Pressable>
            </View>
          </View>

          {/* Search and Filters */}
          <View className="bg-card-light dark:bg-card-dark rounded-xl p-4 shadow-sm border border-border-light dark:border-border-dark flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <View className="relative flex-1 w-full">
              <IconSymbol name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark" size={20} />
              <TextInput
                className="w-full pl-10 pr-4 py-2.5 bg-background-light dark:bg-slate-800/50 border-transparent focus:border-primary focus:ring-0 rounded-lg text-sm transition-colors dark:placeholder-gray-500 text-text-light dark:text-text-dark"
                placeholder="Search by title, clinic or date..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Type Filter */}
            <View className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <View className="px-4 py-2.5 bg-background-light dark:bg-slate-800/50 border-transparent focus:border-primary focus:ring-0 rounded-lg text-sm text-text-light dark:text-text-dark cursor-pointer min-w-[140px]">
                <Text>{selectedType}</Text>
              </View>
              <View className="px-4 py-2.5 bg-background-light dark:bg-slate-800/50 border-transparent focus:border-primary focus:ring-0 rounded-lg text-sm text-text-light dark:text-text-dark cursor-pointer min-w-[140px]">
                <Text>{selectedTime}</Text>
              </View>
            </View>
          </View>

          {/* Documents List */}
          <View className="grid grid-cols-1 gap-3">
            {allDocs.map((document) => {
              const iconConfig = getDocumentIcon(document.type);
              return (
                <View 
                  key={document.id} 
                  className="bg-card-light dark:bg-card-dark rounded-xl p-4 md:p-5 shadow-sm border border-border-light dark:border-border-dark hover:border-primary/50 dark:hover:border-primary/50 transition-colors group"
                >
                  <View className="flex items-center gap-4">
                    <View className={`w-12 h-12 rounded-lg ${iconConfig.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <IconSymbol name={iconConfig.icon} size={24} />
                    </View>

                    <View className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      {/* Document Name and Type */}
                      <View className="md:col-span-4">
                        <Text className="text-base font-bold text-text-light dark:text-text-dark truncate">
                          {document.name}
                        </Text>
                        <Text className="text-xs text-muted-light dark:text-muted-dark font-medium mt-0.5 uppercase tracking-wide">
                          {document.type}
                        </Text>
                      </View>

                      {/* Date */}
                      <View className="md:col-span-3">
                        <View className="flex items-center gap-2 text-sm text-text-light dark:text-text-dark">
                          <IconSymbol name="calendar_today" size={16} className="text-muted-light dark:text-muted-dark" />
                          <Text>{formatDate(document.date)}</Text>
                        </View>
                      </View>

                      {/* Clinic/Provider */}
                      <View className="md:col-span-5">
                        <View className="flex items-center gap-2 text-sm text-text-light dark:text-text-dark">
                          {document.type === 'Invoice' ? (
                            <IconSymbol name="attach_money" size={16} className="text-muted-light dark:text-muted-dark" />
                          ) : (
                            <IconSymbol name="local_hospital" size={16} className="text-muted-light dark:text-muted-dark" />
                          )}
                          <Text>{document.clinic}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="flex items-center gap-1 md:gap-2 pl-2 border-l border-border-light dark:border-border-dark ml-2 md:ml-4">
                      <Pressable 
                        className="p-2 text-muted-light dark:text-muted-dark hover:text-primary hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        title="View"
                      >
                        <IconSymbol name="visibility" size={20} />
                      </Pressable>
                      <Pressable 
                        className="p-2 text-muted-light dark:text-muted-dark hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        title="Download"
                      >
                        <IconSymbol name="download" size={20} />
                      </Pressable>
                      <View className="relative group/more">
                        <Pressable className="p-2 text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                          <IconSymbol name="more_vert" size={20} />
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Load More Button */}
          <View className="flex justify-center pt-4">
            <Pressable className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <Text>Load more documents</Text>
              <IconSymbol name="expand_more" size={16} />
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}