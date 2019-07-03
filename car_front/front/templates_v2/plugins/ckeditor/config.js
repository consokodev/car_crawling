CKEDITOR.editorConfig = function( config ) {
    config.toolbarGroups = [
        { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
        { name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
        { name: 'links' },
        { name: 'insert' },
        { name: 'forms' },
        { name: 'tools' },
        { name: 'document',    groups: [ 'mode', 'document', 'doctools' ] },
        { name: 'others' },
        '/',
        { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
        { name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
        { name: 'styles' },
        { name: 'colors' },
    ];
    config.uiColor = '#8c8c8c';
    config.extraCss += "body{color: #ffffff}";
    config.format_tags = 'p;h1;h2;h3;pre';
    config.removeDialogTabs = 'image:advanced;link:advanced';
    config.extraPlugins = 'uploadimage,font,colorbutton,justify';
    config.height = 453;
    config.width = '100%';
    config.fontSize_defaultLabel = '22';
    config.font_defaultLabel = 'Sharp Sans Regular';
    config.imageUploadUrl = 'https://backend.fujiapp.vn/post/upload-single-image';
};
