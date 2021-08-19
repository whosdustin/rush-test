<script>
  import { Meta, Story } from "@storybook/addon-svelte-csf";
  import { Level, LevelItem } from "@dollop/ui";
</script>

<Meta
  title="Layout/Level"
  component={Level, LevelItem},
/>

<Story name="Centered">
  <Level>
    <LevelItem>
      <div class="has-text-centered">
        <p class="heading">Tweets</p>
        <p class="title">3,456</p>
      </div>
    </LevelItem>
    <LevelItem>
      <div class="has-text-centered">
        <p class="heading">Following</p>
        <p class="title">123</p>
      </div>
    </LevelItem>
    <LevelItem>
      <div class="has-text-centered">
        <p class="heading">Followers</p>
        <p class="title">456K</p>
      </div>
    </LevelItem>
    <LevelItem>
      <div class="has-text-centered">
        <p class="heading">Likes</p>
        <p class="title">789</p>
      </div>
    </LevelItem>
  </Level>
</Story>
