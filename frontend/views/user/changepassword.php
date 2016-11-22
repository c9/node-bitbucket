<?php

/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */
/* @var $model \common\models\LoginForm */

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;

$this->title = 'Change Password';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="site-changepassword">
    <h1><?= Html::encode($this->title) ?></h1>

    <p>Please fill out the following fields to change your password:</p>

    <div class="row">
        <div class="col-lg-5">
            <?php $form = ActiveForm::begin(['id' => 'passwordchange-form']); ?>

                <?= $form->field($model, 'old_password')->passwordInput(['autofocus' => true]) ?>

                <?= $form->field($model, 'new_password')->passwordInput() ?>

                <?= $form->field($model, 'repeat_password')->passwordInput() ?>

                <div class="form-group">
                    <?= Html::submitButton('Change Password', ['class' => 'btn btn-primary', 'name' => 'submit-button']) ?>
                </div>

            <?php ActiveForm::end(); ?>
        </div>
    </div>
</div>
