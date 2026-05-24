# Changelog

## 1.2.0 - 2026-05-24

- Refactored the 5 core cards (`01`-`05`) into a commercial-grade structure:
  - Single north-star metric and explicit non-target users in intent.
  - `Blocker / Warning / Advice` rule hierarchy with trigger and exception semantics.
  - Dual process tracks (minimal loop and full loop) with explicit artifacts.
  - Context lifecycle fields and standardized warning template.
  - Executable acceptance gates and explicit blocker list.
- Synced all preset templates (`presets/coding|media|life`) to the new 5-card structure.
- Synced `hvaos-rules/*.mdc` semantics with the new card model.
- Productized website information architecture:
  - Added `3-minute quickstart` section.
  - Added live `evaluation status` panel from `artifacts/eval-report.json`.
  - Added `troubleshooting` section for common install/verify failures.
- Added remote installer checksum manifest: `website/checksums.txt`.
- Standardized project naming to `HvAOS` in docs and scripts.

## 1.1.0 - 2026-05-24

- Hardened installer with strict shell mode and safe replacement escaping.
- Added local reproducible install mode as default.
- Added optional remote mode: `bash website/install.sh --remote --ref <git-ref>` with SHA256 verification.
- Fixed ZIP generator to embed full `.mdc` rule bodies (no truncation).
- Added verification gate: `scripts/verify-hvaos.sh`.
- Added end-to-end evaluation runner with score output: `scripts/eval-hvaos.sh`.
- Added CI workflow to enforce verification and evaluation on pull requests.
- Updated docs with support matrix, release-gate commands, and commercial claim boundaries.
