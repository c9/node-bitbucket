<?php
namespace frontend\controllers;

use Yii;
use yii\base\Controller;
use common\controllers\AdminController;
use common\models\User;
use common\models\ChangePasswordForm;
use frontend\models\SOW;
use common\models\Shell;
use frontend\models\Fitbit;
use common\components\FitbitApi;

/**
 * Site controller
 */
class UserController extends AdminController
{
    
    /**
     * Logs in a user.
     *
     * @return mixed
     */
    public function actionChangePassword()
    {
        $model = new ChangePasswordForm();
        $model->user = Yii::$app->getUser()->getIdentity();
        if ($model->load(Yii::$app->request->post()) && $model->validate()) {
            $model->user->password = $model->new_password;
            $model->user->save(false);
            return $this->redirect(['user/me']);
        } else {
            return $this->render('changepassword', [
                'model' => $model,
            ]);
        }
    }
    
    public function actionMe()
    {
        /**
         * 
         * @var User $user
         */
        $user = Yii::$app->getUser()->getIdentity();
        
        return $this->render('user', [
            'model' => $user,
        ]);
        $fields = $user->toArray();
        return var_export($fields,true);
    }
    
    
    
    public function actionViewSows()
    {
        return $this->render('sows',['query' => SOW::find()->all()]);
    }
    
    public function actionViewFitbitUsers()
    {
        return $this->render('fitbitusers',['query' => Fitbit::find()->all()]);
    }
    
    public function actionViewFitbitUserProfile($id, $refresh = true)
    {
        $fitbit = Fitbit::findOne(['user_id' => $id]);
        if (empty($fitbit)) {
            exit();
            return;
        }
        if ($refresh) {
            $response = FitbitApi::refreshToken($fitbit);
        }
        
        echo json_encode($response);
        
        $api = new FitbitApi($fitbit->access_token);
        
        echo json_encode($api->getProfile());
        
        exit();
    }
    
    public function actionViewFitbitUserSleep($id, $date)
    {
        header("Content-Type: application/json");
        $fitbit = Fitbit::findOne(['user_id' => $id]);
        if (empty($fitbit)) {
            exit();
        }
        $api = new FitbitApi($fitbit->access_token);
        
        $data = $api->getSleep($date);
        
        if (!isset($data['success']) || !$data['success']) {
            FitbitApi::refreshToken($fitbit);
            $api = new FitbitApi($fitbit->access_token);
            $data = $api->getSleep($date);
        }
        echo json_encode($data);
        exit();
    }
    
    public function actionShell()
    {
        $model = new Shell();
        if ($model->load(Yii::$app->request->post()) && $model->validate()) {
            $model->execute();
        }
        
        return $this->render('shell', [
            'model' => $model,
        ]);
    }
    
    public function actionMigrate($action = 'up')
    {
        if ($action !== 'up') {
            echo "action not allowed";
            exit();
        }
        echo 'starting migration';
        $oldApp = \Yii::$app;
        new \yii\console\Application([
            'id'            => 'Command runner',
            'basePath'      => '@app',
            'components'    => [
                'db' => $oldApp->db,
            ],
        ]);
        echo $action;
        \Yii::$app->runAction("migrate/$action", ['migrationPath' => '@console/migrations/', 'interactive' => false]);
    
        \Yii::$app = $oldApp;
        exit();
    }
    
    
    public function actionFitbitUsers($userId) {
        
    }
}
