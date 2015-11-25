YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "AuthConfig",
        "AuthInterceptorConfiguration",
        "YUIDoc"
    ],
    "modules": [
        "dwAuthConfig",
        "dwAuthInterceptor",
        "dwAuthInterceptorConfiguration",
        "dwAuthService",
        "dwAuthentification"
    ],
    "allModules": [
        {
            "displayName": "dwAuthConfig",
            "name": "dwAuthConfig",
            "description": "This is the __module__ description for the `YUIDoc` module.\n\n    var options = {\n        paths: [ './lib' ],\n        outdir: './out'\n    };\n\n    var Y = require('yuidoc');\n    var json = (new Y.YUIDoc(options)).run();"
        },
        {
            "displayName": "dwAuthentification",
            "name": "dwAuthentification",
            "description": "Angularjs module to capsule login techniques \nContains\n- login directive as login window\n- persistence layer\n- configuration items"
        },
        {
            "displayName": "dwAuthInterceptor",
            "name": "dwAuthInterceptor"
        },
        {
            "displayName": "dwAuthInterceptorConfiguration",
            "name": "dwAuthInterceptorConfiguration",
            "description": "Handles the configuration for page forwarding of HTML error codes"
        },
        {
            "displayName": "dwAuthService",
            "name": "dwAuthService",
            "description": "Handles configuration items for the module"
        }
    ]
} };
});