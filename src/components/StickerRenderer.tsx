import { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Sticker, StickerType } from '../types';

interface StickerRendererProps {
	sticker: Sticker;
	size?: number;
	style?: any;
}

const StickerRenderer: FC<StickerRendererProps> = ({
	sticker,
	size = 50,
	style,
}) => {
	const containerStyle = [
		styles.container,
		{
			width: size,
			height: size,
			borderRadius: size / 2,
		},
		style,
	];

	switch (sticker.type) {
		case StickerType.COLOR:
			return (
				<View
					style={[
						containerStyle,
						{
							backgroundColor: sticker.data,
						},
					]}
				/>
			);

		case StickerType.IMAGE:
			return (
				<View style={containerStyle}>
					<Image
						source={{ uri: sticker.data }}
						style={[
							styles.image,
							{
								width: size,
								height: size,
								borderRadius: size / 2,
							},
						]}
						resizeMode='cover'
					/>
				</View>
			);

		case StickerType.CUSTOM:
			// 커스텀 스티커의 경우 이미지가 있으면 이미지, 없으면 색상
			return (
				<View style={containerStyle}>
					{sticker.data ? (
						<Image
							source={{ uri: sticker.data }}
							style={[
								styles.image,
								{
									width: size,
									height: size,
									borderRadius: size / 2,
								},
							]}
							resizeMode='cover'
						/>
					) : (
						<View
							style={[
								styles.colorFallback,
								{
									backgroundColor: sticker.data,
									width: size,
									height: size,
									borderRadius: size / 2,
								},
							]}
						/>
					)}
				</View>
			);

		default:
			// 기본 fallback
			return (
				<View
					style={[
						containerStyle,
						{
							backgroundColor: sticker.data,
						},
					]}
				/>
			);
	}
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	image: {
		// 이미지 스타일은 동적으로 적용
	},
	colorFallback: {
		// 색상 fallback 스타일은 동적으로 적용
	},
});

export default StickerRenderer;
