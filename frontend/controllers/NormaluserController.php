<?php
namespace frontend\controllers;

use Yii;
use yii\base\Controller;
use common\models\User;
use common\models\ChangePasswordForm;
use frontend\models\SOW;
use common\models\Shell;
use frontend\models\Fitbit;
use common\components\FitbitApi;
use common\controllers\AuthenticatedUserController;

/**
 * Site controller
 */
class NormaluserController extends AuthenticatedUserController
{
    
    const FITBIT_BASE = 'https://www.fitbit.com';
    const FITBIT_API = 'https://api.fitbit.com';
    const FITBIT_AUTHORIZE = '/oauth2/authorize';
   
    
    public function actionViewFitbitUserSleep($date)
    {
        $fitbit = $this->currentUser->fitbit;
        if (empty($fitbit)) {
            echo "user has no fitbit";
            exit();
        }
        header("Content-Type: application/json");
        $fitbit = Fitbit::findOne(['user_id' => $fitbit->user_id]);
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
    
    
    public function actionFitbit()
    {
    
        $client_id = Yii::$app->params['fitbit']['client_id'];
    
        if (!empty($_GET['code'])) {
            $ch = curl_init();
            $fields = [
                'code' => $_GET['code'],
                'grant_type' => 'authorization_code',
                'client_id' => $client_id,
                'redirect_uri' => FitbitApi::getFitbitRedirectUri()
            ];
            curl_setopt($ch, CURLOPT_URL,self::FITBIT_API."/oauth2/token");
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS,http_build_query($fields));  //Post Fields
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
            $headers = [
                'Authorization: Basic '.
                base64_encode(Yii::$app->params['fitbit']['client_id'].
                    ':'.
                    Yii::$app->params['fitbit']['client_secret']
                    ),
                'Content-Type: application/x-www-form-urlencoded'
            ];
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            $response = curl_exec($ch);
            $data = json_decode($response,true);
            curl_close($ch);
            
            if (!isset($data['user_id'])) {
                echo $response;
                exit();
            }
    
    
            $model = Fitbit::findOne(['user_id' => $data['user_id']]);
            if (empty($model)) {
                $model = new Fitbit();
            }
    
    
            $model->response = $response;
    
            $model->setAttributes($data);
            if (!$model->save()) {
                return $this->render('fitbit',[
                    'model' => $model
                ]);
            }
            else {
                $this->currentUser->fitbit_id = $model->id;
                $this->currentUser->save();
                return $this->render('fitbit-thankyou',[
                    'model' => $model
                ]);
            }
        }
        else {
            $this->redirect(self::FITBIT_BASE.self::FITBIT_AUTHORIZE."?".
                "response_type=code".
                "&client_id=".Yii::$app->params['fitbit']['client_id'].
                "&redirect_uri=".FitbitApi::getFitbitRedirectUri().
                "&scope=activity%20heartrate".
                //"%20location".
                //"%20nutrition
                "%20profile".
                //             "%20settings".
                "%20sleep".
                //             "%20social".
                "%20weight".
                "&expires_in=604800"
                );
            return;
        }
    
        var_export($_POST);
        exit();
    
    
        Yii::$app->session->setFlash('success', 'New password was saved.');
    }
    
}
