```
# 1 create patch, change commit and return all to back
hg qimport -r 498:tip
hg qpop -a
joe .hg/patches/498.diff
(change the comment, after the mercurial header)
hg qpush -a
hg qdelete -r qbase:qtip
```

> see changed files in changeset

```
hg status --change rev_number
```

> see difference between revs

```bash
# v.1
hg diff -r 29 -r 30
# v2
hg log -p -l 1
```
