import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Button, Text, YStack, XStack } from 'tamagui';

const Endless = () => {
    const [number, setNumber] = useState(0);

    const increment = () => setNumber(number + 1);
    const decrement = () => setNumber(number - 1);

    return (
        <YStack alignItems='center'>
            
            <XStack justifyContent='space-between'>
            </XStack>
        </YStack>
    );
};

export default Endless;