# VTEX Content Pages

## Description

This is just an easier way to create content pages in your store. It provides an editor for you to create new routes and their content in a single form. You can edit the content using Storefront later as well.

:loudspeaker: **Disclaimer:** Don't fork this project; use, contribute, or open issue with your feature request

## Usage

You must add `store.content` to your `blocks.json` just like the example below:

```json
  "store.content": {
    "children": ["flex-layout.row#content-body"]
  },
  "flex-layout.row#content-body": {
    "children": ["rich-text"]
  }
```

:loudspeaker: **Disclaimer** Content pages won't be available if this block don't be added to your `blocks.json`.

## Continuous Integrations

### Travis CI

![Build Status](https://travis-ci.org/vtex-apps/pages-editor.svg?branch=master)](https://travis-ci.org/vtex-apps/pages-editor)
