import { ScrollView } from 'react-native';
import { Text, H1, H2, H3 } from 'tamagui';
import {
    Button,
    Card,
    Input,
    Badge,
    Avatar,
    Divider,
    YStack,
    XStack,
} from '@/components/base';
import { DesignSystemProvider } from '@/design-system/DesignSystemProvider';

export default function DesignSystemDemo() {
    return (
        <DesignSystemProvider>
            <ScrollView style={{ flex: 1, backgroundColor: '#F6F6F8' }}>
                <YStack padding="$6" gap="$6" paddingBottom="$20">
                    {/* Header */}
                    <YStack gap="$2">
                        <H1>Design System Demo</H1>
                        <Text color="$textSecondary">
                            Testing all base components with Tamagui
                        </Text>
                    </YStack>

                    <Divider />

                    {/* Buttons */}
                    <YStack gap="$4">
                        <H2>Buttons</H2>
                        <Card>
                            <YStack gap="$3">
                                <H3 fontSize="$lg">Themes</H3>
                                <XStack gap="$2" flexWrap="wrap">
                                    <Button theme="primary">Primary</Button>
                                    <Button theme="secondary">Secondary</Button>
                                    <Button theme="success">Success</Button>
                                    <Button theme="danger">Danger</Button>
                                    <Button theme="outline">Outline</Button>
                                    <Button theme="ghost">Ghost</Button>
                                </XStack>

                                <Divider marginVertical="$2" />

                                <H3 fontSize="$lg">Sizes</H3>
                                <XStack gap="$2" alignItems="center">
                                    <Button size="small">Small</Button>
                                    <Button size="medium">Medium</Button>
                                    <Button size="large">Large</Button>
                                </XStack>

                                <Divider marginVertical="$2" />

                                <H3 fontSize="$lg">States</H3>
                                <XStack gap="$2">
                                    <Button disabled>Disabled</Button>
                                    <Button theme="success">Active</Button>
                                </XStack>
                            </YStack>
                        </Card>
                    </YStack>

                    {/* Cards */}
                    <YStack gap="$4">
                        <H2>Cards</H2>
                        <Card variant="default">
                            <Text fontWeight="600">Default Card</Text>
                            <Text color="$textSecondary">Standard shadow and padding</Text>
                        </Card>

                        <Card variant="elevated">
                            <Text fontWeight="600">Elevated Card</Text>
                            <Text color="$textSecondary">Higher shadow for emphasis</Text>
                        </Card>

                        <Card variant="outlined">
                            <Text fontWeight="600">Outlined Card</Text>
                            <Text color="$textSecondary">Border with no shadow</Text>
                        </Card>

                        <Card variant="elevated" pressable onPress={() => alert('Card pressed!')}>
                            <Text fontWeight="600">Pressable Card</Text>
                            <Text color="$textSecondary">Tap me to test interaction</Text>
                        </Card>
                    </YStack>

                    {/* Inputs */}
                    <YStack gap="$4">
                        <H2>Inputs</H2>
                        <Card>
                            <YStack gap="$3">
                                <Input placeholder="Default input" />
                                <Input size="small" placeholder="Small input" />
                                <Input size="large" placeholder="Large input" />
                                <Input error placeholder="Error state input" />
                                <Input disabled placeholder="Disabled input" />
                            </YStack>
                        </Card>
                    </YStack>

                    {/* Badges */}
                    <YStack gap="$4">
                        <H2>Badges</H2>
                        <Card>
                            <YStack gap="$3">
                                <H3 fontSize="$lg">Variants</H3>
                                <XStack gap="$2" flexWrap="wrap">
                                    <Badge>Default</Badge>
                                    <Badge variant="primary">Primary</Badge>
                                    <Badge variant="success">Success</Badge>
                                    <Badge variant="warning">Warning</Badge>
                                    <Badge variant="error">Error</Badge>
                                    <Badge variant="info">Info</Badge>
                                    <Badge variant="outline">Outline</Badge>
                                </XStack>

                                <Divider marginVertical="$2" />

                                <H3 fontSize="$lg">Sizes</H3>
                                <XStack gap="$2" alignItems="center">
                                    <Badge size="small">Small</Badge>
                                    <Badge size="medium">Medium</Badge>
                                    <Badge size="large">Large</Badge>
                                </XStack>
                            </YStack>
                        </Card>
                    </YStack>

                    {/* Avatars */}
                    <YStack gap="$4">
                        <H2>Avatars</H2>
                        <Card>
                            <YStack gap="$3">
                                <H3 fontSize="$lg">Sizes</H3>
                                <XStack gap="$3" alignItems="center">
                                    <Avatar size="small" fallback="S" />
                                    <Avatar size="medium" fallback="M" />
                                    <Avatar size="large" fallback="L" />
                                    <Avatar size="xlarge" fallback="XL" />
                                    <Avatar size="xxlarge" fallback="XX" />
                                </XStack>

                                <Divider marginVertical="$2" />

                                <H3 fontSize="$lg">With Images</H3>
                                <XStack gap="$3" alignItems="center">
                                    <Avatar
                                        src="https://i.pravatar.cc/150?img=1"
                                        alt="User 1"
                                    />
                                    <Avatar
                                        src="https://i.pravatar.cc/150?img=2"
                                        alt="User 2"
                                        size="large"
                                    />
                                    <Avatar fallback="FB" size="large" />
                                </XStack>
                            </YStack>
                        </Card>
                    </YStack>

                    {/* Layout Components */}
                    <YStack gap="$4">
                        <H2>Layout Components</H2>
                        <Card>
                            <YStack gap="$3">
                                <H3 fontSize="$lg">XStack (Horizontal)</H3>
                                <XStack gap="$2">
                                    <Card flex={1} padding="$3">
                                        <Text>Item 1</Text>
                                    </Card>
                                    <Card flex={1} padding="$3">
                                        <Text>Item 2</Text>
                                    </Card>
                                    <Card flex={1} padding="$3">
                                        <Text>Item 3</Text>
                                    </Card>
                                </XStack>

                                <Divider marginVertical="$2" />

                                <H3 fontSize="$lg">YStack (Vertical)</H3>
                                <YStack gap="$2">
                                    <Card padding="$3">
                                        <Text>Item 1</Text>
                                    </Card>
                                    <Card padding="$3">
                                        <Text>Item 2</Text>
                                    </Card>
                                </YStack>
                            </YStack>
                        </Card>
                    </YStack>

                    {/* Real-world Example */}
                    <YStack gap="$4">
                        <H2>Real-World Example</H2>
                        <Card variant="elevated">
                            <YStack gap="$4">
                                <XStack gap="$3" alignItems="center">
                                    <Avatar src="https://i.pravatar.cc/150?img=3" alt="Bella" size="large" />
                                    <YStack flex={1}>
                                        <Text fontSize="$xl" fontWeight="bold">Bella</Text>
                                        <Text color="$textSecondary">Golden Retriever • 3 years</Text>
                                    </YStack>
                                    <Badge variant="success">Active</Badge>
                                </XStack>

                                <Divider />

                                <YStack gap="$2">
                                    <Text fontWeight="600">Weight</Text>
                                    <Input placeholder="Enter weight" />
                                </YStack>

                                <XStack gap="$2">
                                    <Button theme="primary" flex={1}>Save</Button>
                                    <Button theme="outline" flex={1}>Cancel</Button>
                                </XStack>
                            </YStack>
                        </Card>
                    </YStack>
                </YStack>
            </ScrollView>
        </DesignSystemProvider>
    );
}
