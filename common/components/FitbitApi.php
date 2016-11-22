<?php

namespace common\components;

use Yii;
use frontend\models\Fitbit;

class FitbitApi {
    
    
    const BASE_URL = 'https://www.fitbit.com';
    const BASE_API_URL = 'https://api.fitbit.com';
    
    CONST CURRENT_USER = '-';
    
    private $access_token;
    
    public function __construct($access_token) {
        $this->access_token = $access_token;
    }
    
    public function getProfile()
    {
        return static::getProfileWithAccessToken($this->access_token);
    }
    
    public function getSleep($date)
    {
        return static::getSleepWithAccessToken($this->access_token,$date);
    }
    
    public static function getSleepWithAccessToken($access_token,$date, 
        $user_id = self::CURRENT_USER)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,FitbitApi::BASE_API_URL.
            "/1/user/{$user_id}/sleep/date/{$date}.json");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $headers = [
            'Authorization: Bearer '.
            $access_token,
            'Content-Type: application/x-www-form-urlencoded'
        ];
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $response = curl_exec($ch);
        $data = json_decode($response,true);
        curl_close($ch);
        return $data;
    }
    
    public static function getFitbitRedirectUri()
    {
        return "http://".$_SERVER['HTTP_HOST']."/fitbit";
    }
    
    public static function getProfileWithAccessToken($access_token, $user_id = self::CURRENT_USER)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,FitbitApi::BASE_API_URL.
            "/1/user/{$user_id}/profile.json");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $headers = [
            'Authorization: Bearer '.
            $access_token,
            'Content-Type: application/x-www-form-urlencoded'
        ];
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $response = curl_exec($ch);
        $data = json_decode($response,true);
        curl_close($ch);
        return $data;
    }
    
    
    public static function refreshToken(Fitbit $fitbit) {
        $ch = curl_init();
        $fields = [
            'grant_type' => 'refresh_token',
            'refresh_token' => $fitbit->refresh_token,
        ];
        curl_setopt($ch, CURLOPT_URL,FitbitApi::BASE_API_URL."/oauth2/token");
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
        
        if (isset($data['access_token'])) {
            $fitbit->access_token = $data['access_token'];
        }
        if (isset($data['refresh_token'])) {
            $fitbit->refresh_token = $data['refresh_token'];
        }
        if (!$fitbit->save(true,['access_token','refresh_token'])) {
            return $fitbit->getErrors();
        }
        $fitbit->save(true,['access_token','refresh_token']);
        if ($fitbit->hasErrors()) {
            
        }
        curl_close($ch);
        return $data;
    }
    
}