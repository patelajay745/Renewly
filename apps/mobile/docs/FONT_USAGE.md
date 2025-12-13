# Font Usage Guide

## Problem

Writing `fontFamily: "delius"` everywhere is repetitive and hard to maintain.

## Solution

Use custom `Text` and `TextInput` components that automatically apply the Delius font.

## Usage

### Text Component

```tsx
import {Text} from "@/components/text";

// Basic usage - automatically uses Delius font
<Text>Hello World</Text>

// With variants
<Text variant="title">Page Title</Text>
<Text variant="heading">Section Heading</Text>
<Text variant="body">Body text</Text>
<Text variant="caption">Small caption</Text>

// With custom styles (font family is automatically applied)
<Text style={{color: "red", fontSize: 20}}>Custom styled text</Text>
```

### TextInput Component

```tsx
import {TextInput} from "@/components/text-input";

// Basic usage - automatically uses Delius font
<TextInput
  placeholder="Enter text"
  value={value}
  onChangeText={setValue}
/>

// With custom styles (font family is automatically applied)
<TextInput
  style={{
    backgroundColor: colors.inputBackground,
    borderColor: colors.inputBorder,
    height: 50,
  }}
  placeholder="Enter text"
/>
```

## Migration Steps

1. Replace `import {Text} from "react-native"` with `import {Text} from "@/components/text"`
2. Replace `import {TextInput} from "react-native"` with `import {TextInput} from "@/components/text-input"`
3. Remove all `fontFamily: "delius"` from your inline styles
4. The font will be applied automatically!

## Benefits

✅ No more repetitive `fontFamily: "delius"` everywhere
✅ Consistent font across the entire app
✅ Easy to change font family in one place
✅ Type-safe with TypeScript
✅ Optional text variants for common sizes
✅ Can still override styles when needed

## Component Locations

- `components/text.tsx` - Custom Text component
- `components/text-input.tsx` - Custom TextInput component
