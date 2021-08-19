<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import { Image } from "@dollop/ui";
</script>

<Meta
  title="Elements/Image"
  component={Image}
  argTypes={{
    src: { control: "text" },
    alt: { control: "text" },
    caption: { control: "text" },
    ratio: {
      control: "select",
      options: [
        "fullwidth",
        "16x16",
        "24x24",
        "32x32",
        "48x48",
        "64x64",
        "96x96",
        "128x128",
        "square",
        "1by1",
        "5by4",
        "4by3",
        "3by2",
        "5by3",
        "16by9",
        "2by1",
        "3by1",
        "4by5",
        "3by4",
        "2by3",
        "3by5",
        "9by6",
        "1by2",
        "1by3"
      ]
    },
    is_rounded: { control:  "boolean" },
  }}
/>

<Template let:args>
  <Image {...args}  />
</Template>

<Story
  name="Default"
  args={{
    src: "https://placehold.co/200x200",
    alt: "Blank 200 by 200 image placeholder",
    is_rounded: false,
  }}
/>
