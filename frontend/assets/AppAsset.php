<?php

namespace frontend\assets;

use yii\web\AssetBundle;

/**
 * Main frontend application asset bundle.
 */
class AppAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        'css/site.css',
        'ext/bootstrapformhelper-2.3.0/css/bootstrap-formhelpers.css'
    ];
    public $js = [
        'ext/bootstrapformhelper-2.3.0/js/bootstrap-formhelpers.js',
    ];
    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapAsset',
    ];
}
