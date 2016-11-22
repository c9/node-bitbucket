<?php

namespace frontend\models;

use yii\base\Model;
use yii\db\ActiveRecord;

/**
 * Fitbit
 * @property string $response
 * @property string $access_token
 * @property string $refresh_token
 */
class Fitbit extends ActiveRecord
{

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            // name, email, subject and body are required
            [['access_token','refresh_token','user_id'], 'required'],
        ];
    }
   
}
