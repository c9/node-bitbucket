<?php

namespace mootensai\components;

use Yii;
use \yii\validators\Validator;

class OptimisticLockValidator extends Validator {

    public function init() {
        parent::init();
        $this->message = Yii::t('app','Data is already expired');
    }

    /**
     * 
     * @param type $model
     * @param type $attribute
     */
    public function validateAttribute($model, $attribute) {
        if ($model->$attribute < $model->getOldAttribute($attribute)) {
            $this->addError($model, $attribute, $this->message);
        }
    }

}
