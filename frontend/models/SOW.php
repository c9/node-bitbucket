<?php

namespace frontend\models;

use Yii;
use yii\base\Model;
use yii\db\ActiveRecord;

/**
 * ContactForm is the model behind the contact form.
 */
class SOW extends ActiveRecord
{

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            // name, email, subject and body are required
            [['title', 'email','description'], 'required'],
            [['title'], 'string','max' => '32'],
            [['email'], 'string','max' => '255'],
            [['phone'], 'string','max' => '255'],
            // email has to be a valid email address
            ['email', 'email'],
        ];
    }
   
}
