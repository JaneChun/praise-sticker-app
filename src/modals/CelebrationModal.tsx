import { FC, useEffect, useState } from 'react';
import {
	Dimensions,
	Modal,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { CelebrationModalProps } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CelebrationModal: FC<CelebrationModalProps> = ({
	visible,
	setVisible,
	celebrationData,
}) => {
	const [particles, setParticles] = useState<number[]>([]);

	useEffect(() => {
		if (visible) {
			const newParticles = Array.from({ length: 15 }, (_, i) => i);
			setParticles(newParticles);
		} else {
			setParticles([]);
		}
	}, [visible]);

	const onParticleComplete = (id: number) => {
		setParticles((prev) => prev.filter((p) => p !== id));
	};

	return (
		<Modal visible={visible} transparent animationType='fade'>
			<View style={styles.overlay}>
				<View style={styles.celebrationContent}>
					<View style={styles.celebrationIcon}>
						<Text style={styles.celebrationIconText}>
							{celebrationData?.icon}
						</Text>
					</View>
					<Text style={styles.celebrationTitle}>{celebrationData?.title}</Text>
					{celebrationData?.subtitle && (
						<Text style={styles.celebrationSubtitle}>
							{celebrationData.subtitle}
						</Text>
					)}
					<Text style={styles.celebrationDescription}>
						{celebrationData?.description}
					</Text>
					<TouchableOpacity
						style={styles.celebrationButton}
						onPress={() => setVisible(false)}
					>
						<Text style={styles.celebrationButtonText}>계속하기</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: COLORS.background.opacity,
		alignItems: 'center',
		justifyContent: 'center',
	},
	celebrationContent: {
		backgroundColor: COLORS.background.primary,
		borderRadius: 18,
		padding: 40,
		alignItems: 'center',
		maxWidth: 280,
		width: '90%',
	},
	celebrationIcon: {
		width: 80,
		height: 80,
		backgroundColor: COLORS.primary,
		borderRadius: 40,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 20,
	},
	celebrationIconText: {
		fontSize: 36,
		color: COLORS.text.white,
	},
	celebrationTitle: {
		fontSize: 20,
		fontWeight: '700',
		color: COLORS.text.primary,
		marginBottom: 8,
		textAlign: 'center',
	},
	celebrationSubtitle: {
		fontSize: 16,
		color: COLORS.primary,
		fontWeight: '600',
		marginBottom: 16,
	},
	celebrationDescription: {
		fontSize: 14,
		color: COLORS.text.secondary,
		lineHeight: 20,
		textAlign: 'center',
		marginBottom: 24,
	},
	celebrationButton: {
		backgroundColor: COLORS.primary,
		paddingHorizontal: 32,
		paddingVertical: 12,
		borderRadius: 25,
	},
	celebrationButtonText: {
		color: COLORS.text.white,
		fontSize: 16,
		fontWeight: '600',
	},
});

export default CelebrationModal;
