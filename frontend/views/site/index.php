<?php

/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */
/* @var $model \frontend\models\ContactForm */

use yii\helpers\Html;
use kartik\widgets\ActiveForm;

$this->title = 'Welcome';
?>
<div class="site-index">
    <h1>My name is Russ.</h1>

    
    <p>
    If you need an experienced coder to aid in the development of your application. Please fill out the short form below.
    </p>

    <div class="row">
        <div class="col-lg-5">
            <?php $form = ActiveForm::begin(['id' => 'sow-form']); ?>

                <?= $form->field($model, 'title')->textInput(['autofocus' => true])->label('Project Title') ?>

                <?= $form->field($model, 'email') ?>
                
                <?= $form->field($model, 'phone')->textInput(['class' => 'input-medium bfh-phone', 'data-country' => 'US'])->label("Phone (Optional)") ?>

                <?= $form->field($model, 'description')->textarea(['rows' => 6])->label('Description of Project') ?>

                <div class="form-group">
                    <?= Html::submitButton('Submit', ['class' => 'btn btn-primary', 'name' => 'sow-submit']) ?>
                </div>

            <?php ActiveForm::end(); ?>
        </div>
    </div>

</div>