<?php

$params = array_merge(
    require(__DIR__ . '/../../common/config/params.php'),
    require(__DIR__ . '/../../common/config/params-local.php'),
    require(__DIR__ . '/params.php'),
    require(__DIR__ . '/params-local.php')
);

return [
    'id' => 'app-frontend',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    'controllerNamespace' => 'frontend\controllers',
    'components' => [
        'request' => [
            'csrfParam' => '_csrf-frontend',
            'baseUrl' => '',
        ],
        'user' => [
            'identityClass' => 'common\models\User',
            'enableAutoLogin' => true,
            'identityCookie' => ['name' => '_identity-frontend', 'httpOnly' => true],
        ],
        'session' => [
            // this is the name of the session cookie used for login on the frontend
            'name' => 'advanced-frontend',
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'consoleRunner' => [
            'class' => 'toriphes\console\Runner',
        ],
        'errorHandler' => [
            'errorAction' => 'site/error',
        ],
'urlManager' => [
    'enablePrettyUrl' => true,
    'showScriptName' => false,
    'enableStrictParsing' => true,
    'rules' => [
        '' => 'site/index',
        'login' => 'site/login',
        'site/logout' => 'site/logout',
        'logout' => 'site/logout',
        'changepassword' => 'user/change-password',
        'shell' => 'user/shell',
        'fitbit' => 'normaluser/fitbit',
        'migrate/<action:\w+>' => 'user/migrate',
        
        'passwordreset' => 'site/request-password-reset',
        'passwordreset/<token:\S+>' => 'site/reset-password',
        
        
        'me' => 'user/me',
        'sows' => 'user/view-sows',
        'fitbit/users' => 'user/view-fitbit-users',
        'fitbit/users/<id:\w+>/profile' => 'user/view-fitbit-user-profile',
        'fitbit/users/<id:\w+>/sleep/<date:[0-9\-\/]+>' => 'user/view-fitbit-user-sleep',
//         'users/me/sleepreport' => 'normaluser/sleepreport',
        'users/me/sleep/<date:[0-9\-\/]+>' => 'normaluser/view-fitbit-user-sleep',
        
        
        'about' => 'site/about',
        'examples/users/me/sleepreport' => 'site/sleepreport'
        
    ],
],
    ],
    'params' => $params,
];
