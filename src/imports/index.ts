declare module '*.html' {
}

declare module '*.scss' {
}

declare module '*.svg' {
    const svgValue: string;
    export default svgValue;
}

declare module '*.png' {
    const pngValue: string;
    export default pngValue;
}
