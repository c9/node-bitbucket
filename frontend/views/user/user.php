<?php

/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */
/* @var $model \common\models\User */

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;

$this->title = 'User - '.$model->username;
$this->params['breadcrumbs'][] = $this->title;
?>
<div class=site-user>
    <h1><?= Html::encode($this->title) ?></h1>
    
    <div class="row">
        <div class="col-sm-5">
        username
        </div>
        <div class="col-sm-5">
        <?= $model->username; ?>
        </div>
        <div class="col-sm-5">
        status
        </div>
        <div class="col-sm-5">
        <?= $model->status; ?>
        </div>
    </div>
</div>
