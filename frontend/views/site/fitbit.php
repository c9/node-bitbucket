<?php

/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */
/* @var $model \frontend\models\ResetPasswordForm */

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;

$this->title = 'Fitbit';
$this->params['breadcrumbs'][] = $this->title;
if ($model->hasErrors()) {
   Yii::$app->session->setFlash('error', var_export($model->getErrors(),true).$model->response);
}
?>


