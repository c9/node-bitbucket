<?php
namespace common\controllers;

use Yii;
use yii\web\Controller;

/**
 * Site controller
 */
class AdminController extends Controller
{
    
    public function beforeAction($action)
    {
        if (!parent::beforeAction($action)) {
            return false;
        }
        $user = Yii::$app->getUser()->getIdentity();
        if (empty($user) || $user->username !== 'russjohnson09@gmail.com') {
            return $this->redirect(['site/index']);
        }
        return true;
    }
}
