#### logging Database queries
```
LOGGING = {'version': 1,
           'disable_existing_loggers': False,
           'filters': {
               'require_debug_true': {
                   '()': 'django.utils.log.RequireDebugTrue',
               }},
           'handlers': {
               'console': {
                   'level': 'DEBUG',
                   'filters': ['require_debug_true'],
                   'class': 'logging.StreamHandler',
               }},
           'loggers': {
               'django.db.backends': {
                   'level': 'DEBUG',
                   'handlers': ['console'],
                   'propagate': False,
               }}
           
```
