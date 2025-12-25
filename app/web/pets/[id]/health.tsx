import React from 'react';
import { View, ScrollView, Text, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { usePets } from '@/hooks/usePets';
import { useEvents } from '@/hooks/useEvents';
import { useVaccinations } from '@/hooks/useVaccinations';
import { useTreatments } from '@/hooks/useTreatments';
import { useAllergies } from '@/hooks/useAllergies';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function HealthTab() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pets } = usePets();
  const { events } = useEvents({ petIds: [id] });
  const { vaccinations } = useVaccinations(id);
  const { treatments } = useTreatments(id);
  const { allergies } = useAllergies(id);

  const pet = pets?.find(p => p.id === id);
  if (!pet) return null;

  const upcomingEvents = events?.filter(e => new Date(e.date) > new Date()).slice(0, 3) || [];
  const recentEvents = events?.filter(e => new Date(e.date) <= new Date()).slice(0, 3) || [];
  const activeVaccinations = vaccinations?.filter(v => new Date(v.expires_at) > new Date()) || [];
  const currentTreatments = treatments?.filter(t => !t.end_date || new Date(t.end_date) > new Date()) || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getVaccineStatus = (expiresAt: string) => {
    const daysUntil = getDaysUntil(expiresAt);
    if (daysUntil < 0) return 'EXPIRED';
    if (daysUntil <= 30) return 'DUE SOON';
    return 'ACTIVE';
  };

  const getVaccineStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 dark:bg-green-900/30 text-green-600';
      case 'DUE SOON': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600';
      case 'EXPIRED': return 'bg-red-100 dark:bg-red-900/30 text-red-600';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600';
    }
  };

  const getVaccineBorderColor = (status: string) => {
    switch (status) {
      case 'DUE SOON': return 'border-yellow-500/30 bg-yellow-50/50 dark:bg-yellow-900/10';
      default: return 'border-transparent';
    }
  };

  return (
    <ScrollView className="flex-1 bg-background-light dark:bg-background-dark">
      <View className="p-4 lg:p-8">
        <View className="max-w-7xl mx-auto space-y-6">
          {/* Quick Actions */}
          <View className="grid grid-cols-3 md:grid-cols-6 gap-4">
            <Pressable
              onPress={() => router.push(`/web/pets/visit/new?petId=${id}`)}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-card-light dark:bg-card-dark hover:bg-gray-50 dark:hover:bg-slate-800 border border-border-light dark:border-border-dark rounded-xl transition-all hover:shadow-md group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <View className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <IconSymbol name="calendar_add_on" size={20} />
              </View>
              <Text className="text-xs font-medium text-muted-light dark:text-muted-dark">Add Visit</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push(`/web/pets/vaccination/new?petId=${id}`)}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-card-light dark:bg-card-dark hover:bg-gray-50 dark:hover:bg-slate-800 border border-border-light dark:border-border-dark rounded-xl transition-all hover:shadow-md group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <View className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <IconSymbol name="vaccines" size={20} />
              </View>
              <Text className="text-xs font-medium text-muted-light dark:text-muted-dark">Add Vaccine</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push(`/web/pets/treatment/new?petId=${id}`)}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-card-light dark:bg-card-dark hover:bg-gray-50 dark:hover:bg-slate-800 border border-border-light dark:border-border-dark rounded-xl transition-all hover:shadow-md group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <View className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <IconSymbol name="medication" size={20} />
              </View>
              <Text className="text-xs font-medium text-muted-light dark:text-muted-dark">Add Tx</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push(`/web/pets/photos/add?petId=${id}`)}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-card-light dark:bg-card-dark hover:bg-gray-50 dark:hover:bg-slate-800 border border-border-light dark:border-border-dark rounded-xl transition-all hover:shadow-md group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <View className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <IconSymbol name="add_a_photo" size={20} />
              </View>
              <Text className="text-xs font-medium text-muted-light dark:text-muted-dark">Add Image</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push(`/web/pets/documents/add?petId=${id}`)}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-card-light dark:bg-card-dark hover:bg-gray-50 dark:hover:bg-slate-800 border border-border-light dark:border-border-dark rounded-xl transition-all hover:shadow-md group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <View className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <IconSymbol name="note_add" size={20} />
              </View>
              <Text className="text-xs font-medium text-muted-light dark:text-muted-dark">Add Doc</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push(`/web/pets/record/new?petId=${id}`)}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-card-light dark:bg-card-dark hover:bg-gray-50 dark:hover:bg-slate-800 border border-border-light dark:border-border-dark rounded-xl transition-all hover:shadow-md group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <View className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <IconSymbol name="history_edu" size={20} />
              </View>
              <Text className="text-xs font-medium text-muted-light dark:text-muted-dark">Add Record</Text>
            </Pressable>
          </View>

          <View className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visits Section */}
            <View className="lg:col-span-2 space-y-6">
              <View className="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-border-light dark:border-border-dark">
                <View className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <View className="flex items-center gap-3">
                    <View className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                      <IconSymbol name="calendar_month" size={24} />
                    </View>
                    <Text className="text-xl font-bold text-text-light dark:text-text-dark">Visits</Text>
                  </View>
                  <View className="flex items-center gap-2">
                    <Pressable className="px-3 py-1.5 text-sm font-medium rounded-lg text-muted-light dark:text-muted-dark hover:bg-gray-100 dark:hover:bg-slate-800 border border-border-light dark:border-border-dark flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                      <IconSymbol name="filter_list" size={16} />
                      <Text>Filter</Text>
                    </Pressable>
                    <Pressable 
                      onPress={() => router.push(`/web/pets/visit/new?petId=${id}`)}
                      className="px-3 py-1.5 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <IconSymbol name="add" size={16} />
                      <Text>New Visit</Text>
                    </Pressable>
                  </View>
                </View>

                <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Upcoming Visits */}
                  <View className="space-y-3">
                    <Text className="text-xs font-bold text-muted-light dark:text-muted-dark uppercase tracking-wider">Upcoming</Text>
                    {upcomingEvents.length > 0 ? (
                      upcomingEvents.map((event) => {
                        const daysUntil = getDaysUntil(event.date);
                        return (
                          <View key={event.id} className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-5 text-white relative overflow-hidden group hover:shadow-lg transition-all">
                            <View className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></View>
                            <View className="relative z-10">
                              <View className="flex justify-between items-start mb-4">
                                <View className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                  <IconSymbol name="medical_services" size={24} />
                                </View>
                                <Text className="bg-white/20 text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">
                                  {daysUntil === 0 ? 'TODAY' : daysUntil === 1 ? 'TOMORROW' : `${daysUntil} DAYS`}
                                </Text>
                              </View>
                              <Text className="font-bold text-lg">{event.title}</Text>
                              <Text className="text-blue-100 text-sm mb-4">{event.location || 'Vet Clinic'} • {event.veterinarian || 'Dr. Smith'}</Text>
                              <View className="flex items-center justify-between text-sm border-t border-white/20 pt-3">
                                <Text className="flex items-center gap-1">
                                  <IconSymbol name="event" size={16} />
                                  {formatDate(event.date)} {event.time || '09:00 AM'}
                                </Text>
                              </View>
                            </View>
                          </View>
                        );
                      })
                    ) : (
                      <View className="bg-background-light dark:bg-slate-800/50 rounded-xl p-5 text-center">
                        <Text className="text-muted-light dark:text-muted-dark text-sm">No upcoming visits</Text>
                      </View>
                    )}
                  </View>

                  {/* Recent History */}
                  <View className="space-y-3">
                    <Text className="text-xs font-bold text-muted-light dark:text-muted-dark uppercase tracking-wider">Recent History</Text>
                    {recentEvents.length > 0 ? (
                      <View className="space-y-2">
                        {recentEvents.map((event) => (
                          <Pressable
                            key={event.id}
                            className="flex items-center gap-3 p-3 bg-background-light dark:bg-slate-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer transition-colors border border-transparent hover:border-border-light dark:hover:border-border-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          >
                            <View className="flex flex-col items-center justify-center w-10 h-10 bg-card-light dark:bg-slate-700 rounded-lg text-xs font-bold text-muted-light dark:text-muted-dark border border-border-light dark:border-slate-600">
                              <Text>{formatDate(event.date).split(' ')[0]}</Text>
                              <Text>{formatDate(event.date).split(' ')[1]}</Text>
                            </View>
                            <View className="flex-1">
                              <Text className="font-medium text-sm">{event.title}</Text>
                              <Text className="text-xs text-muted-light dark:text-muted-dark">{event.type || 'Consultation'}</Text>
                            </View>
                            <IconSymbol name="chevron_right" size={16} className="text-muted-light dark:text-muted-dark" />
                          </Pressable>
                        ))}
                      </View>
                    ) : (
                      <View className="bg-background-light dark:bg-slate-800/50 rounded-xl p-5 text-center">
                        <Text className="text-muted-light dark:text-muted-dark text-sm">No recent visits</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              {/* Vaccinations */}
              <View className="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-border-light dark:border-border-dark">
                <View className="flex items-center justify-between mb-6">
                  <View className="flex items-center gap-3">
                    <View className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-lg text-pink-600 dark:text-pink-400">
                      <IconSymbol name="vaccines" size={24} />
                    </View>
                    <Text className="text-xl font-bold text-text-light dark:text-text-dark">Vaccinations</Text>
                  </View>
                  <Pressable 
                    onPress={() => router.push(`/web/pets/vaccination/new?petId=${id}`)}
                    className="text-primary font-medium text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <Text>+ Add New</Text>
                  </Pressable>
                </View>

                <View className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {activeVaccinations.length > 0 ? (
                    activeVaccinations.map((vaccination) => {
                      const status = getVaccineStatus(vaccination.expires_at);
                      return (
                        <View key={vaccination.id} className={`bg-background-light dark:bg-slate-800/50 p-4 rounded-xl border hover:border-primary/50 transition-colors group ${getVaccineBorderColor(status)}`}>
                          <View className="flex justify-between items-start mb-3">
                            <View className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
                              <IconSymbol name="check" size={16} />
                            </View>
                            <Text className={`text-[10px] font-bold px-2 py-1 rounded ${getVaccineStatusColor(status)}`}>
                              {status}
                            </Text>
                          </View>
                          <Text className="font-bold text-sm mb-1">{vaccination.name}</Text>
                          <Text className="text-xs text-muted-light dark:text-muted-dark mb-3">{vaccination.brand || 'Standard Vaccine'}</Text>
                          <View className="pt-3 border-t border-border-light dark:border-slate-700">
                            <Text className="text-[10px] text-muted-light dark:text-muted-dark uppercase">Expires</Text>
                            <Text className={`text-sm font-medium ${status === 'DUE SOON' ? 'text-yellow-700 dark:text-yellow-500' : ''}`}>
                              {formatDate(vaccination.expires_at)}
                            </Text>
                          </View>
                        </View>
                      );
                    })
                  ) : (
                    <View className="col-span-full bg-background-light dark:bg-slate-800/50 rounded-xl p-5 text-center">
                      <Text className="text-muted-light dark:text-muted-dark text-sm">No vaccinations recorded</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Treatments & Meds */}
              <View className="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-border-light dark:border-border-dark">
                <View className="flex items-center justify-between mb-6">
                  <View className="flex items-center gap-3">
                    <View className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg text-purple-600 dark:text-purple-400">
                      <IconSymbol name="medication" size={24} />
                    </View>
                    <Text className="text-xl font-bold text-text-light dark:text-text-dark">Treatments & Meds</Text>
                  </View>
                  <View className="flex gap-2">
                    <Pressable className="p-1.5 text-muted-light dark:text-muted-dark hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                      <IconSymbol name="filter_list" size={24} />
                    </Pressable>
                    <Pressable 
                      onPress={() => router.push(`/web/pets/treatment/new?petId=${id}`)}
                      className="text-primary font-medium text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <Text>+ Add Tx</Text>
                    </Pressable>
                  </View>
                </View>

                <View className="space-y-4">
                  {currentTreatments.length > 0 ? (
                    currentTreatments.map((treatment) => (
                      <View key={treatment.id} className="flex items-center gap-4 p-4 bg-background-light dark:bg-slate-800/50 rounded-xl group hover:shadow-md transition-all">
                        <View className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center flex-shrink-0">
                          <IconSymbol name="pill" size={24} />
                        </View>
                        <View className="flex-1 min-w-0">
                          <View className="flex justify-between items-start">
                            <Text className="font-bold text-sm truncate">{treatment.name}</Text>
                            <Text className="text-xs font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded">
                              {treatment.frequency || 'Current'}
                            </Text>
                          </View>
                          <Text className="text-xs text-muted-light dark:text-muted-dark mt-1">{treatment.description || 'For treatment. Follow dosage instructions.'}</Text>
                          <View className="flex items-center gap-4 mt-2 text-xs text-muted-light dark:text-muted-dark">
                            <Text className="flex items-center gap-1">
                              <IconSymbol name="schedule" size={16} />
                              {treatment.frequency || 'As needed'}
                            </Text>
                            {treatment.next_dose && (
                              <Text className="flex items-center gap-1">
                                <IconSymbol name="calendar_today" size={16} />
                                Next: {treatment.next_dose}
                              </Text>
                            )}
                          </View>
                        </View>
                        <Pressable className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                          <IconSymbol name="more_vert" size={16} className="text-muted-light dark:text-muted-dark" />
                        </Pressable>
                      </View>
                    ))
                  ) : (
                    <View className="bg-background-light dark:bg-slate-800/50 rounded-xl p-5 text-center">
                      <Text className="text-muted-light dark:text-muted-dark text-sm">No current treatments</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Allergies Sidebar */}
            <View className="space-y-6">
              <View className="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-border-light dark:border-border-dark">
                <View className="flex items-center justify-between mb-6">
                  <Text className="text-xl font-bold text-text-light dark:text-text-dark">Allergies</Text>
                  <Pressable className="text-primary hover:bg-primary/10 w-8 h-8 flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    <IconSymbol name="edit" size={20} />
                  </Pressable>
                </View>

                <View className="space-y-3">
                  {allergies && allergies.length > 0 ? (
                    allergies.map((allergy) => (
                      <View key={allergy.id} className={`border p-4 rounded-xl flex items-start gap-3 ${allergy.severity === 'severe' ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30' : 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-100 dark:border-yellow-900/30'}`}>
                        <IconSymbol 
                          name={allergy.severity === 'severe' ? 'warning' : 'eco'} 
                          size={20} 
                          className={allergy.severity === 'severe' ? 'text-red-500 mt-0.5' : 'text-yellow-600 dark:text-yellow-500 mt-0.5'} 
                        />
                        <View className="flex-1">
                          <Text className={`font-bold text-sm ${allergy.severity === 'severe' ? 'text-red-700 dark:text-red-400' : 'text-yellow-700 dark:text-yellow-500'}`}>
                            {allergy.name}
                          </Text>
                          <Text className={`text-xs mt-1 ${allergy.severity === 'severe' ? 'text-red-600/80 dark:text-red-400/70' : 'text-yellow-600/80 dark:text-yellow-500/70'}`}>
                            {allergy.description || 'Allergic reaction noted.'}
                          </Text>
                        </View>
                      </View>
                    ))
                  ) : (
                    <View className="bg-background-light dark:bg-slate-800/50 rounded-xl p-5 text-center">
                      <Text className="text-muted-light dark:text-muted-dark text-sm">No allergies recorded</Text>
                    </View>
                  )}
                  <Pressable className="w-full py-2 border border-dashed border-border-light dark:border-border-dark rounded-xl text-sm text-muted-light dark:text-muted-dark hover:border-primary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    <Text>+ Add Allergy</Text>
                  </Pressable>
                </View>
              </View>

              {/* Health Log */}
              <View className="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-border-light dark:border-border-dark">
                <View className="flex items-center justify-between mb-6">
                  <Text className="text-xl font-bold text-text-light dark:text-text-dark">Health Log</Text>
                  <Pressable className="text-muted-light dark:text-muted-dark hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    <IconSymbol name="history" size={24} />
                  </Pressable>
                </View>

                <View className="relative pl-4 space-y-8">
                  {/* Timeline line */}
                  <View className="absolute top-2 left-[15px] bottom-0 w-0.5 bg-border-light dark:bg-border-dark"></View>
                  
                  {/* Weight Check */}
                  <View className="relative z-10 flex gap-3">
                    <View className="flex-shrink-0 mt-1 w-2 h-2 rounded-full bg-primary ring-4 ring-card-light dark:ring-card-dark"></View>
                    <View className="flex-1 pb-2">
                      <View className="flex justify-between items-start">
                        <Text className="font-bold text-sm">Weight Check</Text>
                        <Text className="text-[10px] text-muted-light dark:text-muted-dark">Oct 20</Text>
                      </View>
                      <Text className="text-xs text-muted-light dark:text-muted-dark mt-1">Recorded at home.</Text>
                      <View className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded text-xs font-bold">
                        <Text>24.5 kg</Text>
                        <IconSymbol name="arrow_upward" size={10} />
                      </View>
                    </View>
                  </View>

                  {/* Symptom Log */}
                  <View className="relative z-10 flex gap-3">
                    <View className="flex-shrink-0 mt-1 w-2 h-2 rounded-full bg-gray-400 ring-4 ring-card-light dark:ring-card-dark"></View>
                    <View className="flex-1 pb-2">
                      <View className="flex justify-between items-start">
                        <Text className="font-bold text-sm">Symptom Log</Text>
                        <Text className="text-[10px] text-muted-light dark:text-muted-dark">Oct 12</Text>
                      </View>
                      <Text className="text-xs text-text-light dark:text-text-dark mt-1">Mild lethargy noted in the evening. Appetite normal.</Text>
                    </View>
                  </View>

                  {/* Condition Resolved */}
                  <View className="relative z-10 flex gap-3">
                    <View className="flex-shrink-0 mt-1 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-card-light dark:ring-card-dark"></View>
                    <View className="flex-1 pb-2">
                      <View className="flex justify-between items-start">
                        <Text className="font-bold text-sm">Condition Resolved</Text>
                        <Text className="text-[10px] text-muted-light dark:text-muted-dark">Oct 10</Text>
                      </View>
                      <Text className="text-xs text-text-light dark:text-text-dark mt-1">Otitis Externa (Ear Infection) marked as resolved.</Text>
                    </View>
                  </View>

                  {/* Note Added */}
                  <View className="relative z-10 flex gap-3">
                    <View className="flex-shrink-0 mt-1 w-2 h-2 rounded-full bg-gray-400 ring-4 ring-card-light dark:ring-card-dark"></View>
                    <View className="flex-1 pb-0">
                      <View className="flex justify-between items-start">
                        <Text className="font-bold text-sm">Note Added</Text>
                        <Text className="text-[10px] text-muted-light dark:text-muted-dark">Sep 15</Text>
                      </View>
                      <Text className="text-xs text-muted-light dark:text-muted-dark mt-1">Started new bag of food. Transitioning over 7 days.</Text>
                    </View>
                  </View>
                </View>

                <Pressable className="w-full mt-6 py-2 text-sm text-primary font-medium hover:bg-primary/5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <Text>View Full History</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}