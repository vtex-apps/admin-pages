# VTEX Custom Content

## Description

This is just an easier way to create content pages in your store. It provides an editor for you to create new routes and their content in a single form. You can edit the content using Storefront later as well.

:loudspeaker: **Disclaimer:** Don't fork this project; use, contribute, and/or open issues with your feature requests.

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

## Continuous Integrations

### Travis CI

![Build Status](https://travis-ci.org/vtex-apps/pages-editor.svg?branch=master)](https://travis-ci.org/vtex-apps/pages-editor)
