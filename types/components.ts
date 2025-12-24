import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Database } from './db';

type Pet = Database['public']['Tables']['pets']['Row'];
type EventType = Database['public']['Tables']['events']['Row']['type'];
type Visit = Database['public']['Tables']['medical_visits']['Row'];
type Treatment = Database['public']['Tables']['treatments']['Row'];
type Vaccination = Database['public']['Tables']['vaccinations']['Row'];
type WeightRecord = Database['public']['Tables']['weight_entries']['Row'];

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
  accessibilityLabel?: string;
}

export interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}

export interface PetCardProps {
  pet: Pet;
  onPress?: (pet: Pet) => void;
  showMenu?: boolean;
  onEdit?: (pet: Pet) => void;
  onDelete?: (petId: string) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export interface EventCardProps {
  event: Visit | Treatment | Vaccination | WeightRecord;
  type: EventType;
  onPress?: (event: any) => void;
  onEdit?: (event: any) => void;
  onDelete?: (eventId: string) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    title: string;
    onPress: () => void;
  };
  testID?: string;
}

export interface LoadingIndicatorProps {
  size?: 'small' | 'large';
  color?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export interface TabBarItem {
  name: string;
  route: string;
  icon: string;
  label: string;
  testID?: string;
  accessibilityLabel?: string;
}

export interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  secureTextEntry?: boolean;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  testID?: string;
  accessibilityLabel?: string;
}
