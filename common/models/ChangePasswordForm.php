<?php
namespace common\models;

use Yii;
use yii\base\NotSupportedException;
use yii\behaviors\TimestampBehavior;
use yii\db\ActiveRecord;
use yii\web\IdentityInterface;
use yii\base\Model;

/**
 * User model
 *
 * @property integer $id
 * @property User $user
 * @property string $password
 * @property string $password_reset_token
 * @property string $email
 * @property string $auth_key
 * @property integer $status
 * @property integer $created_at
 * @property integer $updated_at
 * @property string $password write-only password
 */
class ChangePasswordForm extends Model
{

    public $user;

    public $old_password;

    public $new_password;

    public $repeat_password;

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [
                [
                    'user',
                    'old_password',
                    'new_password',
                    'repeat_password'
                ],
                'required'
            ],
            [
                [
                    'old_password',
                    'new_password',
                    'repeat_password'
                ],
                'string'
            ],
            [
                [
                    'old_password'
                ],
                function () {
                    if (! $this->user->validatePassword($this->old_password)) {
                        $this->addError('old_password', 'Old password does not match.');
                    }
                }
            ],
            [
                [
                    'repeat_password'
                ],
                function () {
                    if ($this->new_password !== $this->repeat_password) {
                        $this->addError('repeat_password', 'Repeat password does not match');
                    }
                }
            ]
        ];
    }
}
