<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import { Section } from "@dollop/ui";
</script>

<Meta
  title="Layout/Section"
  component={Section}
  argTypes={{
    content: { control: "text" },
    size: {
      control: "select",
      options: [
        "small",
        "normal",
        "medium",
        "large"
      ]
    },
  }}
/>

<Template let:args>
  <Section {...args}>
    {args.content}
  </Section>
</Template>

<Story
  name="Default"
  args={{
    content: "Lorem ipsum dolor sit amet.",
    size: 'normal'
  }}
/>
