import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { EnhancedButton } from '@/components/ui/EnhancedButton';
import i18n from '@/lib/i18n';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    this.props.onError?.(error, errorInfo);
    
    // Log error to your error reporting service
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={[styles.container, this.props.style]} testID={this.props.testID}>
          <Text style={styles.title}>{i18n.t('errors.something_wrong', { defaultValue: 'Something went wrong' })}</Text>
          <Text style={styles.errorText}>
            {i18n.t('errors.unknown', { defaultValue: 'An unknown error occurred' })}
          </Text>
          {__DEV__ && this.state.errorInfo?.componentStack && (
            <Text style={styles.stackTrace}>
              {this.state.errorInfo.componentStack}
            </Text>
          )}
          <EnhancedButton
            title={i18n.t('common.try_again', { defaultValue: 'Try again' })}
            variant="primary"
            size="md"
            onPress={this.handleReset}
            accessibilityLabel={i18n.t('common.try_again', { defaultValue: 'Try again' })}
          />
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.text,
  },
  errorText: {
    color: colors.error,
    marginBottom: 20,
    textAlign: 'center',
  },
  stackTrace: {
    marginTop: 10,
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: 'monospace',
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default ErrorBoundary;
