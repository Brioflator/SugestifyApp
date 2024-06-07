import { XStack, Avatar, View } from 'tamagui';
import { User } from 'lucide-react-native';
import { Link } from 'expo-router';
import { Pressable } from 'react-native';

interface UserInfoProps {
  userProfile: {
    images?: { url: string }[];
  };
}

export const UserInfo: React.FC<UserInfoProps> = ({ userProfile }) => (
  <XStack alignItems="center" padding={'$2'}>
    <Link href={{ pathname: '/user' }} asChild>
      <Pressable>
        <View>
          {userProfile.images && userProfile.images.length > 0 ? (
            <Avatar circular size="$5">
              <Avatar.Image src={userProfile.images[1].url} />
              <Avatar.Fallback backgroundColor="$blue10" />
            </Avatar>
          ) : (
            <User size={'30px'} color={'white'} />
          )}
        </View>
      </Pressable>
    </Link>
  </XStack>
);