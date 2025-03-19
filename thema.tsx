(async function () {
    const culori = await import('https://cdn.jsdelivr.net/npm/culori/+esm');
  
    const { parse, converter } = culori;
    const toOklch = converter('oklch');
  
    function transformCssVariables(css) {
      return css.replace(/(--[\w-]+):\s*([\d.]+)\s+([\d.]+%)\s+([\d.]+%);/g, (match, varName, h, s, l) => {
        const hslString = `hsl(${h} ${s} ${l})`;
  
        const parsedHSL = parse(hslString);
        if (!parsedHSL) return match;
  
        const oklch = toOklch(parsedHSL);
        if (!oklch || oklch.l === undefined || oklch.c === undefined || oklch.h === undefined) {
          console.warn(`Conversion failed for: ${hslString}`);
          return match;
        }
  
        return `${varName}: oklch(${(oklch.l * 100).toFixed(1)}% ${oklch.c.toFixed(4)} ${oklch.h.toFixed(2)});`;
      });
    }
  
    const cssInput = `
       --background: 0 0% 100%;
    --foreground: 224 71.4% 4.1%;
    --card: 0 0% 100%;
    --card-foreground: 224 71.4% 4.1%;
    --popover: 0 0% 100%;
    --popover-foreground: 224 71.4% 4.1%;
    --primary: 262.1 83.3% 57.8%;
    --primary-foreground: 210 20% 98%;
    --secondary: 220 14.3% 95.9%;
    --secondary-foreground: 220.9 39.3% 11%;
    --muted: 220 14.3% 95.9%;
    --muted-foreground: 220 8.9% 46.1%;
    --accent: 220 14.3% 95.9%;
    --accent-foreground: 220.9 39.3% 11%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 20% 98%;
    --border: 220 13% 91%;
    --input: 220 13% 91%;
    --ring: 262.1 83.3% 57.8%;
    --radius: 0.5rem;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    `;
  
    console.log(transformCssVariables(cssInput));
  })();