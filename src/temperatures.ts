export type ColorRange = {
	min: number;
	max: number;
	minIncluded?: boolean;
	maxIncluded?: boolean;
	color: string;
};

const colorRanges: ColorRange[] = [
	{max: 999, min: 30, minIncluded: true, color: '#17421e'},
	{max: 30, min: 15, minIncluded: true, color: '#215e2c'},
	{max: 15, min: 5, minIncluded: true, color: '#518651'},
	{max: 5, min: 0, color: '#7ec17e'},
	{max: 0, min: -5, color: '#ed7171'},
	{max: -5, min: -15, maxIncluded: true, color: '#c84040'},
	{max: -15, min: -9999, maxIncluded: true, color: '#aa2121'},
];

export function determineColor(change: number) {
	for (const range of colorRanges) {
		if (
			(change < range.max || (range.maxIncluded && change <= range.max)) &&
			(change > range.min || (range.minIncluded && change >= range.min))
		) {
			return range.color;
		}
	}
	return '#bdbdbd';
}
