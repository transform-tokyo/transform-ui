---
title: Player 播放器
---

## Player 播放器

### VideoPlayer

```tsx
import React from 'react';
import { Player } from 'transform-ui';

export default () => (
  <Player.VideoPlayer
    src={
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    }
    title="BigBuckBunny.mp4"
  />
);
```

### AudioPlayer

```tsx
import React from 'react';
import { Player } from 'transform-ui';

export default () => (
  <Player.AudioPlayer
    src={'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1468070/Boost.mp3'}
    title="Boost.mp3"
  />
);
```

More skills for writing demo: https://d.umijs.org/guide/demo-principle
