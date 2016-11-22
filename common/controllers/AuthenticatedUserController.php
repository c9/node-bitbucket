<?php
namespace common\controllers;

use Yii;
use yii\web\Controller;
use common\models\User;

/**
 * Site controller
 */
class AuthenticatedUserController extends Controller
{
    
    /**
     * 
     * @var User
     */
    protected $currentUser;
    
    public function beforeAction($action)
    {
        if (!parent::beforeAction($action)) {
            return false;
        }
        $this->currentUser = $user =  Yii::$app->getUser()->getIdentity();
        if (empty($user)) {
            return $this->redirect(['site/index']);
        }
        return true;
    }
}
