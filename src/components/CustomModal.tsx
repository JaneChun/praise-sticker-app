import { Portal } from '@gorhom/portal';
import { FC, ReactNode } from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

interface CustomModalProps {
	visible: boolean;
	onClose: () => void;
	children: ReactNode;
	backdropOpacity?: number;
}

const CustomModal: FC<CustomModalProps> = ({
	visible,
	onClose,
	children,
	backdropOpacity = 0.5,
}) => {
	if (Platform.OS === 'ios') {
		return (
			<Modal
				isVisible={visible}
				animationIn='fadeIn'
				animationOut='fadeOut'
				onBackdropPress={onClose}
				backdropOpacity={backdropOpacity}
			>
				{children}
			</Modal>
		);
	}

	return (
		<Portal>
			<Pressable
				style={[
					styles.backdrop,
					{
						backgroundColor: `rgba(0, 0, 0, ${backdropOpacity})`,
					},
				]}
				onPress={onClose}
			>
				{children}
			</Pressable>
		</Portal>
	);
};

const styles = StyleSheet.create({
	backdrop: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1000,
	},
});

export default CustomModal;
