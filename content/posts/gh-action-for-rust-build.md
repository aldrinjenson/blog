---
title: "Github release workflow for Rust projects"
date: 2023-09-20T14:42:38+05:30
draft: true
description: "Nots about a Gihub action workflow that I wrote to release rust binaries for 5 different architectures"
tags: ["rust", github-action, "yaml"]
---

## Introduction

This is a github workflow I wrote for Parsable's release system

```yaml
name: Release builds for Mac(64bit, Arm), Windows and Linux(64 bit, Arm)

on:
  push:
    tags:
      - v[0-9]+.[0-9]+.[0-9]+*
    paths-ignore:
      - "docs/**"
      - "helm/**"
      - "assets/**"
      - "**.md"

jobs:
  build-linux:
    name: Build for ${{matrix.target}}
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        target:
          - aarch64-unknown-linux-gnu # linux(arm)
          - x86_64-unknown-linux-gnu # linux(64 bit)
    steps:
      - uses: actions/checkout@v2
      - uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
          profile: minimal # minimal component installation (ie, no documentation)
          target: ${{matrix.target}}
          override: true

      - uses: actions-rs/cargo@v1
        with:
          use-cross: true
          command: build
          args: --release --target ${{matrix.target}}

      - name: Create Artifact
        uses: actions/upload-artifact@v3
        with:
          name: Parseable_${{ matrix.target }}
          path: target/${{ matrix.target }}/release/parseable

      - name: Rename binary
        run: |
          mv target/${{ matrix.target }}/release/parseable Parseable_${{ matrix.target }}

      - name: Publish Archive to Release Page
        uses: softprops/action-gh-release@v0.1.15
        if: ${{ startsWith(github.ref, 'refs/tags/') }}
        with:
          draft: false
          files: Parseable_${{ matrix.target }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  build-windows:
    runs-on: windows-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v1

      - name: Install latest rust toolchain
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
          profile: minimal
          default: true
          override: true

      - name: Build
        run: cargo build --all --release --target x86_64-pc-windows-msvc

      - name: Create artifact for Windows
        uses: actions/upload-artifact@v2
        with:
          name: Parseable_x86_64-pc-windows-msvc
          path: target/x86_64-pc-windows-msvc/release/PARSEABLE.exe

      - name: Rename binary
        run: |
          mv target/x86_64-pc-windows-msvc/release/PARSEABLE.exe Parseable_x86_64-pc-windows-msvc.exe

      - name: Publish Archive to Release Page
        uses: softprops/action-gh-release@v0.1.15
        if: ${{ startsWith(github.ref, 'refs/tags/') }}
        with:
          draft: false
          files: Parseable_x86_64-pc-windows-msvc.exe
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  build-mac:
    runs-on: macos-latest
    strategy:
      matrix:
        target:
          - aarch64-apple-darwin
          - x86_64-apple-darwin

    steps:
      - name: Checkout
        uses: actions/checkout@v1

      - name: Install latest rust toolchain
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
          profile: minimal
          target: ${{ matrix.target }}
          default: true
          override: true

      - name: Build
        run: |
          cargo build --release --target ${{ matrix.target }}
          strip target/${{ matrix.target }}/release/Parseable

      - name: Create artifact
        uses: actions/upload-artifact@v2
        with:
          name: Parseable_${{ matrix.target }}
          path: |
            target/${{ matrix.target }}/release/Parseable

      - name: Rename binary
        run: |
          mv target/${{ matrix.target }}/release/Parseable Parseable_${{ matrix.target }}

      - name: Publish Archive to Release Page
        uses: softprops/action-gh-release@v0.1.15
        if: ${{ startsWith(github.ref, 'refs/tags/') }}
        with:
          draft: false
          files: Parseable_${{ matrix.target }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
