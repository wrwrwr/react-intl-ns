* Importing from `react-intl/lib/format` unnecessarily doubles bundle size,
  however the unbound versions of `format*()` that `react-intl` includes do not
  seem to be accessible from any of the exported objects.

* The "string-magic" (prefixing ids with a namespace) could be avoided if
  unknown message props would be carried over to the message descriptor
  (we would then simply pass a separate namespace prop).
