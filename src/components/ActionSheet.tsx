import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';

export interface ActionSheetOption {
	title: string;
	onPress: () => void;
	destructive?: boolean;
}

interface ActionSheetProps {
	visible: boolean;
	onClose: () => void;
	options: ActionSheetOption[];
}

const ActionSheet: FC<ActionSheetProps> = ({ visible, onClose, options }) => {
	const insets = useSafeAreaInsets();

	const handleOptionPress = (onPress: () => void) => {
		onClose();
		// 약간의 지연 후 액션 실행 (애니메이션 완료 후)
		setTimeout(onPress, 200);
	};

	return (
		<Modal
			isVisible={visible}
			animationIn='slideInUp'
			animationOut='slideOutDown'
			onBackdropPress={onClose}
			onBackButtonPress={onClose}
			backdropOpacity={0.5}
			style={styles.modal}
		>
			<View style={[styles.container, { paddingBottom: insets.bottom }]}>
				<View style={styles.optionsContainer}>
					{options.map((option, index) => (
						<TouchableOpacity
							key={index}
							style={[
								styles.optionButton,
								index === 0 && styles.firstOption,
								index === options.length - 1 && styles.lastOption,
							]}
							onPress={() => handleOptionPress(option.onPress)}
						>
							<Text
								style={[
									styles.optionText,
									option.destructive && styles.destructiveText,
								]}
							>
								{option.title}
							</Text>
						</TouchableOpacity>
					))}
				</View>

				<TouchableOpacity style={styles.cancelButton} onPress={onClose}>
					<Text style={styles.cancelText}>취소</Text>
				</TouchableOpacity>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modal: {
		justifyContent: 'flex-end',
		margin: 0,
	},
	container: {
		backgroundColor: 'transparent',
		paddingHorizontal: 20,
	},
	titleContainer: {
		backgroundColor: COLORS.background.primary,
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
		paddingVertical: 16,
		paddingHorizontal: 20,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.border.light,
	},
	title: {
		fontSize: 14,
		color: COLORS.text.secondary,
		textAlign: 'center',
		fontWeight: '500',
	},
	optionsContainer: {
		backgroundColor: COLORS.background.primary,
		borderRadius: 16,
		overflow: 'hidden',
		marginBottom: 8,
	},
	optionButton: {
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.border.light,
	},
	firstOption: {
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
	},
	lastOption: {
		borderBottomWidth: 0,
		borderBottomLeftRadius: 12,
		borderBottomRightRadius: 12,
	},
	optionText: {
		fontSize: 16,
		color: COLORS.text.primary,
		textAlign: 'center',
		fontWeight: '500',
	},
	destructiveText: {
		color: COLORS.error,
	},
	cancelButton: {
		backgroundColor: COLORS.background.primary,
		borderRadius: 16,
		padding: 20,
	},
	cancelText: {
		fontSize: 16,
		color: COLORS.text.primary,
		textAlign: 'center',
		fontWeight: '600',
	},
});

export default ActionSheet;
